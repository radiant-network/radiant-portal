// Package bigwig reads the full-resolution data of a bigWig file (UCSC format, see
// https://genome.ucsc.edu/goldenPath/help/bigWig.html and the bbiFile.h / bwgInternal.h layouts).
// The zoom levels and summaries are not read.
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
		return nil, err
	}
	chromTreeStart, err := f.offset(head[8:])
	if err != nil {
		return nil, err
	}
	chroms, err := f.readChromTree(chromTreeStart)
	if err != nil {
		return nil, err
	}
	f.indexStart, f.chroms = indexStart, chroms
	return f, nil
}

func (f *File) Chroms() []Chrom {
	return f.chroms
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
		return nil, err
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
			return err
		}
		if err := f.walkChromNode(child, keySize, chroms); err != nil {
			return err
		}
	}
	return nil
}

type block struct {
	offset int64
	size   int
}

// Intervals returns every interval of a chromosome, in file order (sorted by start). A chromosome
// of the header with no data gives none; a name absent from the header is an error.
func (f *File) Intervals(chrom string) ([]Interval, error) {
	id, ok := f.chromID(chrom)
	if !ok {
		return nil, fmt.Errorf("chromosome %q not in bigwig", chrom)
	}
	head, err := f.readAt(f.indexStart, rTreeHeadSize)
	if err != nil {
		return nil, fmt.Errorf("read index: %w", err)
	}
	if f.order.Uint32(head) != rTreeMagic {
		return nil, errors.New("bad index magic")
	}
	var blocks []block
	if err := f.walkIndexNode(f.indexStart+rTreeHeadSize, id, &blocks); err != nil {
		return nil, err
	}
	var intervals []Interval
	for _, b := range blocks {
		data, err := f.readBlock(b)
		if err != nil {
			return nil, err
		}
		if intervals, err = f.decodeSections(data, id, intervals); err != nil {
			return nil, err
		}
	}
	return intervals, nil
}

func (f *File) chromID(name string) (uint32, bool) {
	for _, c := range f.chroms {
		if c.Name == name {
			return c.ID, true
		}
	}
	return 0, false
}

// walkIndexNode collects the data blocks whose chromosome range covers the chromosome.
func (f *File) walkIndexNode(offset int64, chromID uint32, blocks *[]block) error {
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
		startChrom, endChrom := f.order.Uint32(item), f.order.Uint32(item[8:])
		if chromID < startChrom || chromID > endChrom {
			continue
		}
		offset, err := f.offset(item[16:])
		if err != nil {
			return err
		}
		if isLeaf {
			size, err := f.offset(item[24:])
			if err != nil {
				return err
			}
			*blocks = append(*blocks, block{offset: offset, size: int(size)})
			continue
		}
		if err := f.walkIndexNode(offset, chromID, blocks); err != nil {
			return err
		}
	}
	return nil
}

func (f *File) readBlock(b block) ([]byte, error) {
	raw, err := f.readAt(b.offset, b.size)
	if err != nil {
		return nil, fmt.Errorf("read data block: %w", err)
	}
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

func (f *File) decodeSections(data []byte, chromID uint32, intervals []Interval) ([]Interval, error) {
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
		if chrom == chromID {
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
				intervals = append(intervals, iv)
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
