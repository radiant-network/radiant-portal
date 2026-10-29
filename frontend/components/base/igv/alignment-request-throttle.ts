const MAX_IN_FLIGHT = 20;
const ALIGNMENT_FILE_URL = /\.(cram|bam)(\?|$)/i;

const throttledPrototypes = new WeakSet<XMLHttpRequest>();

// igv.js opens one XMLHttpRequest per range request, so the cap goes on the prototype.
export const throttleAlignmentRequests = (
  xhrClass: typeof XMLHttpRequest = XMLHttpRequest,
  maxInFlight = MAX_IN_FLIGHT,
) => {
  const { prototype } = xhrClass;
  if (throttledPrototypes.has(prototype)) return;
  throttledPrototypes.add(prototype);

  const { open, send } = prototype;
  const throttledRequests = new WeakSet<XMLHttpRequest>();
  const queue: (() => void)[] = [];
  let inFlight = 0;

  const release = () => {
    inFlight -= 1;
    queue.shift()?.();
  };

  prototype.open = function (this: XMLHttpRequest, ...args: unknown[]) {
    if (ALIGNMENT_FILE_URL.test(String(args[1]))) throttledRequests.add(this);
    else throttledRequests.delete(this);
    return Reflect.apply(open, this, args);
  };

  prototype.send = function (this: XMLHttpRequest, body?: Document | XMLHttpRequestBodyInit | null) {
    if (!throttledRequests.has(this)) return send.call(this, body);

    const start = () => {
      inFlight += 1;
      this.addEventListener('loadend', release, { once: true });
      send.call(this, body);
    };
    if (inFlight < maxInFlight) start();
    else queue.push(start);
  };
};
