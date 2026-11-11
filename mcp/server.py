"""Thin shim for backwards compatibility (Docker CMD, existing scripts)."""

import asyncio

from radiant_mcp.__main__ import main

if __name__ == "__main__":
    asyncio.run(main())
