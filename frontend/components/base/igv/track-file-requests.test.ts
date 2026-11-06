import { describe, expect, it } from 'vitest';

import { getTrackFileRequests } from './track-file-requests';

const CRAM_URL = 'https://files.example/sample.cram?X-Amz-Signature=abc';
const CRAI_URL = 'https://files.example/sample.cram.crai?X-Amz-Signature=abc';
const API_URL = 'https://api.example/radiant/igv/1';

const createRequestClass = () => {
  const sent: FakeRequest[] = [];
  const aborted: FakeRequest[] = [];
  class FakeRequest extends EventTarget {
    url = '';
    open(...args: string[]) {
      this.url = args[1];
    }
    send() {
      sent.push(this);
    }
    abort() {
      aborted.push(this);
      this.dispatchEvent(new Event('loadend'));
    }
    finish() {
      this.dispatchEvent(new Event('loadend'));
    }
  }
  const requests = getTrackFileRequests(FakeRequest as unknown as typeof XMLHttpRequest);
  return { FakeRequest, requests, sent, aborted };
};

const startRequests = (Request: ReturnType<typeof createRequestClass>['FakeRequest'], count: number, url: string) =>
  Array.from({ length: count }, () => {
    const request = new Request();
    request.open('GET', url);
    request.send();
    return request;
  });

describe('getTrackFileRequests', () => {
  it('never has more than 2 alignment requests in flight', () => {
    const { FakeRequest, sent } = createRequestClass();
    const requests = startRequests(FakeRequest, 5, CRAM_URL);

    expect(sent).toEqual(requests.slice(0, 2));

    requests[0].finish();

    expect(sent).toEqual(requests.slice(0, 3));
  });

  it('does not hold index and API requests behind alignment requests', () => {
    const { FakeRequest, sent } = createRequestClass();
    startRequests(FakeRequest, 3, CRAM_URL);
    const [index] = startRequests(FakeRequest, 1, CRAI_URL);
    const [api] = startRequests(FakeRequest, 1, API_URL);

    expect(sent).toHaveLength(4);
    expect(sent).toContain(index);
    expect(sent).toContain(api);
  });

  it('aborts the watched requests in flight and drops the queued ones', () => {
    const { FakeRequest, requests, sent, aborted } = createRequestClass();
    requests.watch([CRAM_URL, CRAI_URL]);
    const alignments = startRequests(FakeRequest, 4, CRAM_URL);
    const [index] = startRequests(FakeRequest, 1, CRAI_URL);
    const [api] = startRequests(FakeRequest, 1, API_URL);

    requests.abort();

    expect(aborted).toEqual([alignments[0], alignments[1], index]);
    expect(aborted).not.toContain(api);
    expect(sent).not.toContain(alignments[2]);
    expect(sent).not.toContain(alignments[3]);
  });

  it('frees the alignment slots of the aborted requests', () => {
    const { FakeRequest, requests, sent } = createRequestClass();
    requests.watch([CRAM_URL]);
    startRequests(FakeRequest, 2, CRAM_URL);

    requests.abort();
    const [next] = startRequests(FakeRequest, 1, 'https://files.example/next.cram?X-Amz-Signature=def');

    expect(sent).toContain(next);
  });

  it('never sends a request opened on a closed browser file after the abort', () => {
    const { FakeRequest, requests, sent } = createRequestClass();
    requests.watch([CRAI_URL]);
    requests.abort();

    const [late] = startRequests(FakeRequest, 1, CRAI_URL);

    expect(sent).not.toContain(late);
  });

  it('sends again a file watched by the next browser', () => {
    const { FakeRequest, requests, sent } = createRequestClass();
    requests.watch([CRAI_URL]);
    requests.abort();
    requests.watch([CRAI_URL]);

    const [request] = startRequests(FakeRequest, 1, CRAI_URL);

    expect(sent).toContain(request);
  });

  it('patches the request class once', () => {
    const { FakeRequest, requests } = createRequestClass();

    expect(getTrackFileRequests(FakeRequest as unknown as typeof XMLHttpRequest)).toBe(requests);
  });
});
