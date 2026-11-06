// 4 of the 6 connections a browser opens per host stay free for the indexes and the small track files.
const MAX_ALIGNMENT_REQUESTS_IN_FLIGHT = 2;
const ALIGNMENT_FILE_URL = /\.(cram|bam)(\?|$)/i;

export type TrackFileRequests = {
  watch: (urls: string[]) => void;
  abort: () => void;
};

const installedRequests = new WeakMap<XMLHttpRequest, TrackFileRequests>();

// igv.js opens one XMLHttpRequest per request and never aborts it, so the cap and the abort go on the prototype.
// URLs match exactly: the presigned URLs of a closed browser never match the ones of the next opening.
export const getTrackFileRequests = (
  xhrClass: typeof XMLHttpRequest = XMLHttpRequest,
  maxAlignmentRequests = MAX_ALIGNMENT_REQUESTS_IN_FLIGHT,
): TrackFileRequests => {
  const { prototype } = xhrClass;
  const installed = installedRequests.get(prototype);
  if (installed) return installed;

  const { open, send } = prototype;
  let watchedUrls = new Set<string>();
  let abortedUrls = new Set<string>();
  const alignmentRequests = new WeakSet<XMLHttpRequest>();
  const watchedRequests = new WeakSet<XMLHttpRequest>();
  const abortedRequests = new WeakSet<XMLHttpRequest>();
  const watchedRequestsInFlight = new Set<XMLHttpRequest>();
  let queue: { request: XMLHttpRequest; start: () => void }[] = [];
  let alignmentRequestsInFlight = 0;

  const mark = (requests: WeakSet<XMLHttpRequest>, request: XMLHttpRequest, marked: boolean) =>
    marked ? requests.add(request) : requests.delete(request);

  const release = () => {
    alignmentRequestsInFlight -= 1;
    queue.shift()?.start();
  };

  prototype.open = function (this: XMLHttpRequest, ...args: unknown[]) {
    const url = String(args[1]);
    mark(alignmentRequests, this, ALIGNMENT_FILE_URL.test(url));
    mark(watchedRequests, this, watchedUrls.has(url));
    mark(abortedRequests, this, abortedUrls.has(url));
    return Reflect.apply(open, this, args);
  };

  prototype.send = function (this: XMLHttpRequest, body?: Document | XMLHttpRequestBodyInit | null) {
    // Opened by a closed browser after the abort: igv.js no longer waits for it.
    if (abortedRequests.has(this)) return;

    const start = () => {
      if (watchedRequests.has(this)) {
        watchedRequestsInFlight.add(this);
        this.addEventListener('loadend', () => watchedRequestsInFlight.delete(this), { once: true });
      }
      if (alignmentRequests.has(this)) {
        alignmentRequestsInFlight += 1;
        this.addEventListener('loadend', release, { once: true });
      }
      send.call(this, body);
    };
    if (!alignmentRequests.has(this) || alignmentRequestsInFlight < maxAlignmentRequests) start();
    else queue.push({ request: this, start });
  };

  const requests: TrackFileRequests = {
    watch: urls =>
      urls.forEach(url => {
        watchedUrls.add(url);
        abortedUrls.delete(url);
      }),
    abort: () => {
      abortedUrls = watchedUrls;
      watchedUrls = new Set();
      queue = queue.filter(({ request }) => !watchedRequests.has(request));
      // An abort fires loadend at once, which frees the slot of an alignment request.
      [...watchedRequestsInFlight].forEach(request => request.abort());
    },
  };
  installedRequests.set(prototype, requests);
  return requests;
};
