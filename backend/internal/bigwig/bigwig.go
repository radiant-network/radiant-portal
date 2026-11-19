// Package bigwig reads a bigWig file (UCSC format, see
// https://genome.ucsc.edu/goldenPath/help/bigWig.html and the bbiFile.h / bwgInternal.h layouts):
// the full-resolution data, whole chromosomes or a region. Only the blocks a query needs are read,
// so a ReaderAt over ranged object storage reads little of a large file.
package bigwig

import (
	"bytes"
	"compress/zlib"
	"encoding/binary"
	"errors"
	"fmt"
	"io"
	"math"
)

const (
	bigWigMagic    = 0x888FFC26
	chromTreeMagic = 0x78CA8C91
	rTreeMagic     = 0x2468ACE0

	headerSize        = 64
	chromTreeHeadSize = 32
	rTreeHeadSize     = 48
	nodeHeadSize      = 4
	rTreeLeafItemSize = 32
	rTreeNodeItemSize = 24
	sectionHeadSize   = 24
)

const (
	sectionBedGraph  = 1
	sectionVarStep   = 2
	sectionFixedStep = 3
)

type Chrom struct {
	Name string
	ID   uint32
	Size uint32
}

// Interval is a half-open [Start, End) range with its value.
type Interval struct {
	Start uint32
	End   uint32
	Value float32
}

type File struct {
	r          io.ReaderAt
	order      binary.ByteOrder
	compressed bool
	indexStart int64
	chroms     []Chrom
	// basesCovered counts the bases that carry a value, from the file's total summary.
	basesCovered uint64
}

func Open(r io.ReaderAt) (*File, error) {
	head := make([]byte, headerSize)
	if _, err := r.ReadAt(head, 0); err != nil {
		return nil, fmt.Errorf("read bigwig header: %w", err)
	}
	var order binary.ByteOrder
	switch {
	case binary.LittleEndian.Uint32(head) == bigWigMagic:
		order = binary.LittleEndian
	case binary.BigEndian.Uint32(head) == bigWigMagic:
		order = binary.BigEndian
	default:
		return nil, errors.New("not a bigwig file")
	}
	f := &File{r: r, order: order, compressed: order.Uint32(head[52:]) > 0}
	indexStart, err := f.offset(head[24:])
	if err != nil {
		return nil, fmt.Errorf("read index offset: %w", err)
	}
	if f.basesCovered, err = f.readBasesCovered(head[44:]); err != nil {
		return nil, fmt.Errorf("read bases covered: %w", err)
	}
	chromTreeStart, err := f.offset(head[8:])
	if err != nil {
		return nil, fmt.Errorf("read chromosome tree offset: %w", err)
	}
	chroms, err := f.readChromTree(chromTreeStart)
	if err != nil {
		return nil, fmt.Errorf("read chromosomes: %w", err)
	}
	f.indexStart, f.chroms = indexStart, chroms
	return f, nil
}

func (f *File) Chroms() []Chrom {
	return f.chroms
}

// BasesCovered counts the bases that carry a value, over all chromosomes: the number of points
// of a file of 1-base intervals, such as a BAF.
func (f *File) BasesCovered() uint64 {
	return f.basesCovered
}

func (f *File) readBasesCovered(summaryOffset []byte) (uint64, error) {
	offset, err := f.offset(summaryOffset)
	if err != nil {
		return 0, fmt.Errorf("read total summary offset: %w", err)
	}
	if offset == 0 {
		return 0, nil
	}
	summary, err := f.readAt(offset, 8)
	if err != nil {
		return 0, fmt.Errorf("read total summary: %w", err)
	}
	return f.order.Uint64(summary), nil
}

func (f *File) readAt(offset int64, size int) ([]byte, error) {
	buf := make([]byte, size)
	if _, err := f.r.ReadAt(buf, offset); err != nil {
		return nil, fmt.Errorf("read %d bytes at %d: %w", size, offset, err)
	}
	return buf, nil
}

func (f *File) readChromTree(offset int64) ([]Chrom, error) {
	head, err := f.readAt(offset, chromTreeHeadSize)
	if err != nil {
		return nil, fmt.Errorf("read chromosome tree: %w", err)
	}
	if f.order.Uint32(head) != chromTreeMagic {
		return nil, errors.New("bad chromosome tree magic")
	}
	keySize := int(f.order.Uint32(head[8:]))
	var chroms []Chrom
	if err := f.walkChromNode(offset+chromTreeHeadSize, keySize, &chroms); err != nil {
		return nil, fmt.Errorf("walk chromosome tree: %w", err)
	}
	return chroms, nil
}

func (f *File) walkChromNode(offset int64, keySize int, chroms *[]Chrom) error {
	head, err := f.readAt(offset, nodeHeadSize)
	if err != nil {
		return fmt.Errorf("read chromosome tree node: %w", err)
	}
	isLeaf, count := head[0] == 1, int(f.order.Uint16(head[2:]))
	itemSize := keySize + 8
	items, err := f.readAt(offset+nodeHeadSize, count*itemSize)
	if err != nil {
		return fmt.Errorf("read chromosome tree items: %w", err)
	}
	for i := range count {
		item := items[i*itemSize : (i+1)*itemSize]
		if isLeaf {
			*chroms = append(*chroms, Chrom{
				Name: string(bytes.TrimRight(item[:keySize], "\x00")),
				ID:   f.order.Uint32(item[keySize:]),
				Size: f.order.Uint32(item[keySize+4:]),
			})
			continue
		}
		child, err := f.offset(item[keySize:])
		if err != nil {
			return fmt.Errorf("read chromosome tree child offset: %w", err)
		}
		if err := f.walkChromNode(child, keySize, chroms); err != nil {
			return fmt.Errorf("chromosome tree node at %d: %w", child, err)
		}
	}
	return nil
}

type block struct {
	offset int64
	size   int
}

// region is a half-open range of one chromosome, [start, end).
type region struct {
	chromID uint32
	start   uint32
	end     uint32
}

// Intervals returns every interval of a chromosome, in file order (sorted by start). A chromosome
// of the header with no data gives none; a name absent from the header is an error.
func (f *File) Intervals(chrom string) ([]Interval, error) {
	return f.IntervalsIn(chrom, 0, math.MaxUint32)
}

// IntervalsIn returns the intervals of a chromosome that overlap [start, end), in file order.
func (f *File) IntervalsIn(chrom string, start, end uint32) ([]Interval, error) {
	q, err := f.region(chrom, start, end)
	if err != nil {
		return nil, fmt.Errorf("read intervals: %w", err)
	}
	var intervals []Interval
	err = f.readRegion(f.indexStart, q, func(data []byte) error {
		if intervals, err = f.decodeSections(data, q, intervals); err != nil {
			return fmt.Errorf("decode sections: %w", err)
		}
		return nil
	})
	if err != nil {
		return nil, fmt.Errorf("read intervals of %s:%d-%d: %w", chrom, start, end, err)
	}
	return intervals, nil
}

func (f *File) region(chrom string, start, end uint32) (region, error) {
	id, ok := f.chromID(chrom)
	if !ok {
		return region{}, fmt.Errorf("chromosome %q not in bigwig", chrom)
	}
	return region{chromID: id, start: start, end: end}, nil
}

func (f *File) chromID(name string) (uint32, bool) {
	for _, c := range f.chroms {
		if c.Name == name {
			return c.ID, true
		}
	}
	return 0, false
}

// readRegion hands each block of an R-tree index that overlaps the region to decode, inflated.
// Adjacent blocks are read at once: a region's blocks are contiguous in the file.
func (f *File) readRegion(indexStart int64, q region, decode func([]byte) error) error {
	head, err := f.readAt(indexStart, rTreeHeadSize)
	if err != nil {
		return fmt.Errorf("read index: %w", err)
	}
	if f.order.Uint32(head) != rTreeMagic {
		return errors.New("bad index magic")
	}
	var blocks []block
	if err := f.walkIndexNode(indexStart+rTreeHeadSize, q, &blocks); err != nil {
		return fmt.Errorf("walk index: %w", err)
	}
	for _, run := range contiguousRuns(blocks) {
		first, last := run[0], run[len(run)-1]
		raw, err := f.readAt(first.offset, int(last.offset-first.offset)+last.size)
		if err != nil {
			return fmt.Errorf("read data blocks: %w", err)
		}
		for _, b := range run {
			start := b.offset - first.offset
			data, err := f.inflate(raw[start : start+int64(b.size)])
			if err != nil {
				return fmt.Errorf("block at %d: %w", b.offset, err)
			}
			if err := decode(data); err != nil {
				return fmt.Errorf("block at %d: %w", b.offset, err)
			}
		}
	}
	return nil
}

func contiguousRuns(blocks []block) [][]block {
	var runs [][]block
	for i, b := range blocks {
		if i > 0 {
			prev := blocks[i-1]
			if b.offset == prev.offset+int64(prev.size) {
				runs[len(runs)-1] = append(runs[len(runs)-1], b)
				continue
			}
		}
		runs = append(runs, []block{b})
	}
	return runs
}

// walkIndexNode collects the data blocks whose range overlaps the region. An item's range runs
// from (startChrom, startBase) to (endChrom, endBase), end excluded.
func (f *File) walkIndexNode(offset int64, q region, blocks *[]block) error {
	head, err := f.readAt(offset, nodeHeadSize)
	if err != nil {
		return fmt.Errorf("read index node: %w", err)
	}
	isLeaf, count := head[0] == 1, int(f.order.Uint16(head[2:]))
	itemSize := rTreeNodeItemSize
	if isLeaf {
		itemSize = rTreeLeafItemSize
	}
	items, err := f.readAt(offset+nodeHeadSize, count*itemSize)
	if err != nil {
		return fmt.Errorf("read index items: %w", err)
	}
	for i := range count {
		item := items[i*itemSize : (i+1)*itemSize]
		startChrom, startBase := f.order.Uint32(item), f.order.Uint32(item[4:])
		endChrom, endBase := f.order.Uint32(item[8:]), f.order.Uint32(item[12:])
		if !q.overlaps(startChrom, startBase, endChrom, endBase) {
			continue
		}
		offset, err := f.offset(item[16:])
		if err != nil {
			return fmt.Errorf("read index item offset: %w", err)
		}
		if isLeaf {
			size, err := f.offset(item[24:])
			if err != nil {
				return fmt.Errorf("read index item size: %w", err)
			}
			*blocks = append(*blocks, block{offset: offset, size: int(size)})
			continue
		}
		if err := f.walkIndexNode(offset, q, blocks); err != nil {
			return fmt.Errorf("index node at %d: %w", offset, err)
		}
	}
	return nil
}

func (q region) overlaps(startChrom, startBase, endChrom, endBase uint32) bool {
	beforeEnd := startChrom < q.chromID || (startChrom == q.chromID && startBase < q.end)
	afterStart := endChrom > q.chromID || (endChrom == q.chromID && endBase > q.start)
	return beforeEnd && afterStart
}

func (q region) contains(chromID, start, end uint32) bool {
	return chromID == q.chromID && start < q.end && end > q.start
}

func (f *File) inflate(raw []byte) ([]byte, error) {
	if !f.compressed {
		return raw, nil
	}
	zr, err := zlib.NewReader(bytes.NewReader(raw))
	if err != nil {
		return nil, fmt.Errorf("open data block: %w", err)
	}
	defer func() { _ = zr.Close() }()
	data, err := io.ReadAll(zr)
	if err != nil {
		return nil, fmt.Errorf("inflate data block: %w", err)
	}
	return data, nil
}

func (f *File) decodeSections(data []byte, q region, intervals []Interval) ([]Interval, error) {
	for len(data) > 0 {
		if len(data) < sectionHeadSize {
			return nil, errors.New("truncated section header")
		}
		chrom := f.order.Uint32(data)
		start := f.order.Uint32(data[4:])
		step, span := f.order.Uint32(data[12:]), f.order.Uint32(data[16:])
		kind, count := data[20], int(f.order.Uint16(data[22:]))
		data = data[sectionHeadSize:]

		var itemSize int
		switch kind {
		case sectionBedGraph:
			itemSize = 12
		case sectionVarStep:
			itemSize = 8
		case sectionFixedStep:
			itemSize = 4
		default:
			return nil, fmt.Errorf("unknown section type %d", kind)
		}
		if len(data) < count*itemSize {
			return nil, errors.New("truncated section")
		}
		if chrom == q.chromID {
			fixedStart := start
			for i := range count {
				item := data[i*itemSize:]
				var iv Interval
				switch kind {
				case sectionBedGraph:
					iv = Interval{Start: f.order.Uint32(item), End: f.order.Uint32(item[4:]), Value: f.float(item[8:])}
				case sectionVarStep:
					s := f.order.Uint32(item)
					iv = Interval{Start: s, End: s + span, Value: f.float(item[4:])}
				case sectionFixedStep:
					iv = Interval{Start: fixedStart, End: fixedStart + span, Value: f.float(item)}
					fixedStart += step
				}
				if q.contains(chrom, iv.Start, iv.End) {
					intervals = append(intervals, iv)
				}
			}
		}
		data = data[count*itemSize:]
	}
	return intervals, nil
}

// offset reads a 64-bit file offset or size, which io.ReaderAt takes as an int64.
func (f *File) offset(b []byte) (int64, error) {
	v := f.order.Uint64(b)
	if v > math.MaxInt64 {
		return 0, fmt.Errorf("offset %d out of range", v)
	}
	return int64(v), nil
}

func (f *File) float(b []byte) float32 {
	return math.Float32frombits(f.order.Uint32(b))
}
