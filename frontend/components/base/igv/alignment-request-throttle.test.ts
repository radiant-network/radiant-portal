import { describe, expect, it } from 'vitest';

import { throttleAlignmentRequests } from './alignment-request-throttle';

const CRAM_URL = 'https://files.example/sample.cram?X-Amz-Signature=abc';

const createRequestClass = () => {
  const sent: FakeRequest[] = [];
  class FakeRequest extends EventTarget {
    url = '';
    open(...args: string[]) {
      this.url = args[1];
    }
    send() {
      sent.push(this);
    }
    finish() {
      this.dispatchEvent(new Event('loadend'));
    }
  }
  throttleAlignmentRequests(FakeRequest as unknown as typeof XMLHttpRequest);
  return { FakeRequest, sent };
};

const startRequests = (Request: ReturnType<typeof createRequestClass>['FakeRequest'], count: number, url: string) =>
  Array.from({ length: count }, () => {
    const request = new Request();
    request.open('GET', url);
    request.send();
    return request;
  });

describe('throttleAlignmentRequests', () => {
  it('never has more than 20 alignment requests in flight', () => {
    const { FakeRequest, sent } = createRequestClass();
    const requests = startRequests(FakeRequest, 25, CRAM_URL);

    expect(sent).toHaveLength(20);

    requests[0].finish();
    requests[1].finish();

    expect(sent).toHaveLength(22);
    expect(sent.slice(20)).toEqual([requests[20], requests[21]]);
  });

  it('does not hold index and API requests behind alignment requests', () => {
    const { FakeRequest, sent } = createRequestClass();
    startRequests(FakeRequest, 21, CRAM_URL);
    const [index] = startRequests(FakeRequest, 1, 'https://files.example/sample.cram.crai?X-Amz-Signature=abc');
    const [api] = startRequests(FakeRequest, 1, 'https://api.example/radiant/igv/1');

    expect(sent).toHaveLength(22);
    expect(sent).toContain(index);
    expect(sent).toContain(api);
  });
});
