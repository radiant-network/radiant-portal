#!/usr/bin/env python3
"""Print the moon inputs of each backend image: the files of the Go packages its binaries import.

    python3 scripts/go-image-inputs.py <cmd>...   (run from backend/)
"""
import json, subprocess, sys

def inputs(cmds):
    mod = subprocess.check_output(["go", "list", "-m"], text=True).strip()
    out = subprocess.check_output(["go", "list", "-deps", "-json", *[f"./cmd/{c}" for c in cmds]], text=True)
    dec, pos, files = json.JSONDecoder(), 0, set()
    while pos < len(out):
        pkg, pos = dec.raw_decode(out, pos)
        pos += len(out[pos:]) - len(out[pos:].lstrip())
        if pkg.get("Module", {}).get("Path") != mod:
            continue
        rel = pkg["ImportPath"].removeprefix(mod).lstrip("/") or "."
        files.add(f"{rel}/*.go")  # the package directory (tests excluded by the caller)
        for f in pkg.get("EmbedFiles", []):
            files.add(f"{rel}/{f}")
    return sorted(files)

if __name__ == "__main__":
    print(json.dumps(inputs(sys.argv[1:])))
