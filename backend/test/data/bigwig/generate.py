"""Writes the bigWig fixtures of internal/bigwig and the CNV profile tests.

usage: uv run --no-project --with pyBigWig --with numpy python generate.py
"""
import pyBigWig

HEADER = [("chr1", 1000), ("chr2", 500), ("chrX", 300)]


def write(name, header, add):
    bw = pyBigWig.open(name, "w")
    bw.addHeader(header, maxZooms=0)
    add(bw)
    bw.close()


def sections(bw):
    bw.addEntries(["chr1", "chr1", "chr1"], [0, 100, 200], ends=[100, 200, 300], values=[0.0, 1.5, -1.0])
    bw.addEntries("chr2", [10, 50], values=[0.25, 0.75], span=5)
    bw.addEntries("chrX", 100, values=[0.1, 0.2, 0.3], span=10, step=20)


def tn(bw):
    bw.addEntries(["chr1", "chr1", "chr2"], [0, 100, 0], ends=[100, 200, 100], values=[0.0, 1.0, -1.0])


def baf(bw):
    bw.addEntries(["chr1", "chr1", "chr2"], [10, 150, 20], ends=[11, 151, 21], values=[0.5, 0.25, 1.0])


write("sections.bw", HEADER, sections)
write("tn.bw", HEADER, tn)
write("baf.bw", [("chr1", 1000), ("chr2", 500)], baf)
