"""The worker pool shared by every caller (``radiant_mcp.workers``) and the portal client limits."""

import threading

import anyio
import pytest

from radiant_mcp import portal_api as _api
from radiant_mcp import workers
from radiant_mcp.results import ToolFailure


def test_a_call_runs_on_a_worker_thread_and_returns_its_value():
    caller = threading.get_ident()
    assert anyio.run(workers.run, lambda: threading.get_ident()) != caller


def test_a_full_server_answers_busy_instead_of_queueing(configure):
    configure(mcp_max_concurrent_calls=1, mcp_queue_timeout=0.05)
    release = threading.Event()

    async def main():
        async with anyio.create_task_group() as tg:
            tg.start_soon(workers.run, lambda: release.wait(5))
            await anyio.sleep(0.05)
            try:
                with pytest.raises(ToolFailure) as exc:
                    await workers.run(lambda: "never")
            finally:
                release.set()
        return exc.value.error

    error = anyio.run(main)
    assert error.code == "upstream" and "busy" in error.message
    # The slot is released: the next call runs.
    assert anyio.run(workers.run, lambda: "ok") == "ok"


def test_the_portal_client_does_not_retry_and_has_a_connect_timeout(configure):
    configure(radiant_api_url="http://api.example", radiant_api_timeout=30, radiant_api_connect_timeout=2)
    with _api.connect("jwt") as api:
        assert api.client.configuration.retries is False
        assert api._timeout == (2, 30)
