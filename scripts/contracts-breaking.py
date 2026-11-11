"""Compare the data contracts of a folder with the base of the change: which product version does it need?

  python scripts/contracts-breaking.py <contracts dir> [base ref, default $CONTRACTS_BASE or main]

The monorepo has one product release (`v<version>` on every image, release-please at the root). Each contract change
needs a version bump of the product; the PR title (Conventional Commits, it becomes the squash commit release-please
reads) must declare at least that bump:

  none   description, usage, quality, readers: any title
  minor  column, contract or enum value added; column or contract deprecated: `feat:`
  major  removal of what a release shipped deprecated; type changed; no longer required; enum value removed:
         `!` in the title (`feat(etl)!: ...`) or a `BREAKING CHANGE:` footer in the PR body

A removal goes through expand/contract, two releases apart:

  1. deprecate (minor): tag the column `deprecated` (or the contract `status: deprecated`). The readers stop reading it
     in the same change: their tests only see the columns that are not deprecated.
  2. remove (major): once a release ($CONTRACTS_RELEASE, default: the last v* tag before the base) shipped it
     deprecated. Every image of that release is deployed together, so no deployed reader still reads it.

Removing what no release shipped deprecated is refused, whatever the title.

The title comes from $CONTRACTS_PR_TITLE (and the body from $CONTRACTS_PR_BODY), set by CI on a pull request. Without
a title (local run, push), the needed bump is printed and only a refused removal fails.
"""

import os
import re
import subprocess
import sys
from pathlib import Path

import yaml

DEPRECATED = "deprecated"
NONE, MINOR, MAJOR, REFUSED = 0, 1, 2, 3
LEVEL = {NONE: "none", MINOR: "minor", MAJOR: "major", REFUSED: "refused"}
TITLE = re.compile(r"^(?P<type>\w+)(?:\([^)]*\))?(?P<bang>!)?:\s")


def git(*args: str) -> str:
    return subprocess.run(["git", *args], capture_output=True, text=True, check=True).stdout.strip()


def load_head(directory: Path) -> dict[str, dict]:
    return {p.relative_to(directory).as_posix(): yaml.safe_load(p.read_text())
            for p in sorted(directory.rglob("*.odcs.yaml"))}


def load_ref(directory: Path, ref: str) -> dict[str, dict]:
    rel = directory.resolve().relative_to(Path(git("rev-parse", "--show-toplevel"))).as_posix()
    files = git("ls-tree", "-r", "--full-tree", "--name-only", ref, "--", rel).split()
    return {f.removeprefix(rel + "/"): yaml.safe_load(git("show", f"{ref}:{f}"))
            for f in files if f.endswith(".odcs.yaml")}


def release_ref(base: str) -> str:
    """The release deployed before this change: $CONTRACTS_RELEASE, else the last v* tag reachable from the base."""
    if ref := os.getenv("CONTRACTS_RELEASE"):
        return ref
    try:
        return git("describe", "--tags", "--abbrev=0", "--match", "v*", base)
    except subprocess.CalledProcessError:
        return ""  # no release yet: nothing was ever deployed deprecated


def declared(title: str, body: str) -> int:
    """The bump a Conventional Commits title declares, as release-please reads it."""
    m = TITLE.match(title)
    if not m:
        raise SystemExit(f"PR title {title!r} is not a Conventional Commit (`type(scope): subject`)")
    if m["bang"] or re.search(r"^BREAKING[ -]CHANGE:", body, re.M):
        return MAJOR
    return MINOR if m["type"] == "feat" else NONE


def props(contract: dict | None) -> dict[str, dict]:
    return {p["name"]: p for p in contract["schema"][0]["properties"]} if contract else {}


def is_deprecated(prop: dict | None) -> bool:
    return bool(prop) and DEPRECATED in (prop.get("tags") or [])


def enum_values(prop: dict) -> set:
    return {str(e["value"]) for e in (prop.get("items") or prop).get("enum", [])}


def compare(old: dict, new: dict, released: dict | None) -> list[tuple[int, str]]:
    """The changes of one contract, each with the bump it needs."""
    out = []
    old_p, new_p, rel_p = props(old), props(new), props(released)
    for c in sorted(old_p.keys() - new_p.keys()):
        if is_deprecated(rel_p.get(c)):
            out.append((MAJOR, f"column {c} removed (the release shipped it deprecated)"))
        elif is_deprecated(old_p[c]):
            out.append((REFUSED, f"column {c} removed, deprecated but not released yet: remove it after the next release"))
        else:
            out.append((REFUSED, f"column {c} removed without deprecation: tag it `{DEPRECATED}` first"))
    out += [(MINOR, f"column {c} added") for c in sorted(new_p.keys() - old_p.keys())]
    for c in sorted(old_p.keys() & new_p.keys()):
        o, n = old_p[c], new_p[c]
        for key in ("logicalType", "physicalType"):
            if str(o.get(key, "")).replace(" ", "").upper() != str(n.get(key, "")).replace(" ", "").upper():
                out.append((MAJOR, f"{c}: {key} {o.get(key)} -> {n.get(key)} (or add a new column: minor)"))
        if o.get("required") and not n.get("required"):
            out.append((MAJOR, f"{c}: no longer required (can be NULL)"))
        if removed := enum_values(o) - enum_values(n):
            out.append((MAJOR, f"{c}: enum values removed {sorted(removed)}"))
        if added := enum_values(n) - enum_values(o):
            out.append((MINOR, f"{c}: enum values added {sorted(added)}"))
        if is_deprecated(n) and not is_deprecated(o):
            out.append((MINOR, f"{c}: deprecated (its readers stop reading it now; remove it after the next release)"))
    if new.get("status") == DEPRECATED and old.get("status") != DEPRECATED:
        out.append((MINOR, "contract deprecated (its readers stop reading it now; remove it after the next release)"))
    if not out and old != new:
        out.append((NONE, "description or metadata changed"))
    return out


def readers(contract: dict) -> str:
    teams = [t["username"] for t in contract.get("team", []) if t.get("role") == "consumer"]
    files = next((cp["value"] for cp in contract["schema"][0].get("customProperties", [])
                  if cp["property"] == "consumers"), [])
    return ", ".join(teams) + (f" ({len(files)} files: {', '.join(files[:3])}{'...' if len(files) > 3 else ''})"
                               if files else "")


def main() -> int:
    directory = Path(sys.argv[1])
    base_ref = sys.argv[2] if len(sys.argv) > 2 else os.getenv("CONTRACTS_BASE", "main")
    rel_ref = release_ref(base_ref)
    base, head = load_ref(directory, base_ref), load_head(directory)
    released = load_ref(directory, rel_ref) if rel_ref else {}
    needed = NONE
    for name in sorted(base.keys() | head.keys()):
        old, new = base.get(name), head.get(name)
        if old is None:
            changes = [(MINOR, "new contract")]
        elif new is None:
            changes = [(MAJOR, "contract removed (the release shipped it deprecated)")
                       if (released.get(name) or {}).get("status") == DEPRECATED else
                       (REFUSED, f"contract removed without deprecation: `status: {DEPRECATED}` first")]
        else:
            changes = compare(old, new, released.get(name))
        if not changes:
            continue
        level = max(lvl for lvl, _ in changes)
        needed = max(needed, level)
        print(f"{'✗' if level == REFUSED else '+'} {name}")
        for lvl, line in sorted(changes, reverse=True):
            print(f"    {LEVEL[lvl]:<8}  {line}")
        if level >= MAJOR:
            print(f"    readers   {readers(old or new)}")

    since = f"since {base_ref} (release checked: {rel_ref or 'none yet'})"
    if needed == REFUSED:
        print(f"{directory}: refused {since}, whatever the PR title")
        return 1
    print(f"{directory}: needs a {LEVEL[needed]} bump {since}")
    title = os.getenv("CONTRACTS_PR_TITLE")
    if not title:
        return 0  # local run or push: nothing declared
    got = declared(title, os.getenv("CONTRACTS_PR_BODY", ""))
    if got < needed:
        hint = "add `!` (`feat(scope)!: ...`)" if needed == MAJOR else "use `feat:`"
        print(f"✗ the PR title {title!r} declares a {LEVEL[got]} bump, the contracts need {LEVEL[needed]}: {hint}")
        return 1
    print(f"the PR title declares a {LEVEL[got]} bump: ok")
    return 0


if __name__ == "__main__":
    sys.exit(main())
