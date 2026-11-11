"""The worker threads that run the tool bodies, shared by every caller.

Tool bodies are synchronous (the portal client, the MySQL connector,
matplotlib) and run on anyio worker threads. Without a cap of their own they
share anyio's default limiter (40 threads) with no deadline: a burst of slow
StarRocks queries or a hung portal would queue every other user's call behind
them while ``/health`` still answers. ``run`` admits at most
``MCP_MAX_CONCURRENT_CALLS`` bodies at once; a call that cannot start within
``MCP_QUEUE_TIMEOUT`` seconds fails fast with ``upstream`` ("busy, retry").
"""

from collections.abc import Callable
from typing import TypeVar

import anyio

from .results import ToolFailure
from .settings import get_settings

T = TypeVar("T")

_slots: anyio.Semaphore | None = None
_threads: anyio.CapacityLimiter | None = None


def _pool() -> tuple[anyio.Semaphore, anyio.CapacityLimiter]:
    """Created on first use, inside the event loop, sized from the settings."""
    global _slots, _threads
    if _slots is None or _threads is None:
        size = get_settings().mcp_max_concurrent_calls
        _slots, _threads = anyio.Semaphore(size), anyio.CapacityLimiter(size)
    return _slots, _threads


def reset() -> None:
    """Forget the pool (tests): the next call sizes it from the settings again."""
    global _slots, _threads
    _slots = _threads = None


async def run(fn: Callable[[], T]) -> T:
    """``fn()`` on a worker thread, or ``ToolFailure("upstream")`` when the server is full."""
    slots, threads = _pool()
    wait = get_settings().mcp_queue_timeout
    admitted = False
    with anyio.move_on_after(wait):
        await slots.acquire()
        admitted = True
    if not admitted:
        raise ToolFailure(
            "upstream",
            f"The server is busy ({get_settings().mcp_max_concurrent_calls} tool calls running); "
            "retry in a moment.",
        )
    try:
        # The thread limiter is as large as the semaphore, so an admitted call never waits here.
        return await anyio.to_thread.run_sync(fn, limiter=threads)
    finally:
        slots.release()
