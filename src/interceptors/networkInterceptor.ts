import type { NetworkRequest } from '../types';
import { generateId } from '../utils/generateId';

type NetworkCallback = (request: NetworkRequest) => void;
type NetworkUpdateCallback = (
  id: string,
  updates: Partial<NetworkRequest>
) => void;

let isIntercepting = false;
let onRequestStart: NetworkCallback | null = null;
let onRequestEnd: NetworkUpdateCallback | null = null;

const originalFetch = global.fetch;
const originalXHROpen = XMLHttpRequest.prototype.open;
const originalXHRSend = XMLHttpRequest.prototype.send;
const originalXHRSetRequestHeader = XMLHttpRequest.prototype.setRequestHeader;

function interceptFetch(): void {
  global.fetch = async function (
    input: RequestInfo | URL,
    init?: RequestInit
  ): Promise<Response> {
    const id = generateId();
    const startTime = Date.now();
    const url =
      typeof input === 'string'
        ? input
        : input instanceof URL
        ? input.toString()
        : (input as Request).url;
    const method = init?.method || 'GET';

    let requestBody: unknown;
    if (init?.body) {
      try {
        requestBody =
          typeof init.body === 'string' ? JSON.parse(init.body) : init.body;
      } catch {
        requestBody = init.body;
      }
    }

    const requestHeaders: Record<string, string> = {};
    if (init?.headers) {
      if (init.headers instanceof Headers) {
        init.headers.forEach((value: string, key: string) => {
          requestHeaders[key] = value;
        });
      } else if (Array.isArray(init.headers)) {
        init.headers.forEach(([key, value]) => {
          requestHeaders[key] = value;
        });
      } else {
        Object.assign(requestHeaders, init.headers);
      }
    }

    if (onRequestStart) {
      onRequestStart({
        id,
        method: method.toUpperCase(),
        url,
        startTime,
        requestHeaders,
        requestBody,
      });
    }

    try {
      const fetchInput = input instanceof URL ? input.toString() : input;
      const response = await originalFetch.call(global, fetchInput, init);
      const endTime = Date.now();

      const responseHeaders: Record<string, string> = {};
      response.headers.forEach((value: string, key: string) => {
        responseHeaders[key] = value;
      });

      let responseBody: unknown;
      const clonedResponse = response.clone();
      try {
        const contentType = response.headers.get('content-type') || '';
        if (contentType.includes('application/json')) {
          responseBody = await clonedResponse.json();
        } else {
          responseBody = await clonedResponse.text();
        }
      } catch {
        responseBody = '[Unable to parse response]';
      }

      if (onRequestEnd) {
        onRequestEnd(id, {
          status: response.status,
          statusText: response.statusText,
          endTime,
          duration: endTime - startTime,
          responseHeaders,
          responseBody,
        });
      }

      return response;
    } catch (error) {
      const endTime = Date.now();
      if (onRequestEnd) {
        onRequestEnd(id, {
          endTime,
          duration: endTime - startTime,
          error: error instanceof Error ? error.message : String(error),
        });
      }
      throw error;
    }
  };
}

function interceptXHR(): void {
  const xhrData = new WeakMap<
    XMLHttpRequest,
    {
      id: string;
      method: string;
      url: string;
      startTime: number;
      requestHeaders: Record<string, string>;
      requestBody?: unknown;
    }
  >();

  XMLHttpRequest.prototype.open = function (
    method: string,
    url: string | URL,
    async: boolean = true,
    username?: string | null,
    password?: string | null
  ): void {
    const id = generateId();
    xhrData.set(this, {
      id,
      method: method.toUpperCase(),
      url: url.toString(),
      startTime: 0,
      requestHeaders: {},
    });

    return originalXHROpen.call(
      this,
      method,
      url.toString(),
      async,
      username,
      password
    );
  };

  XMLHttpRequest.prototype.setRequestHeader = function (
    name: string,
    value: string
  ): void {
    const data = xhrData.get(this);
    if (data) {
      data.requestHeaders[name] = value;
    }
    return originalXHRSetRequestHeader.call(this, name, value);
  };

  XMLHttpRequest.prototype.send = function (
    body?:
      | Document
      | string
      | Blob
      | ArrayBufferView
      | ArrayBuffer
      | FormData
      | URLSearchParams
      | null
  ): void {
    const data = xhrData.get(this);

    if (data) {
      data.startTime = Date.now();

      if (body) {
        try {
          data.requestBody = typeof body === 'string' ? JSON.parse(body) : body;
        } catch {
          data.requestBody = body;
        }
      }

      if (onRequestStart) {
        onRequestStart({
          id: data.id,
          method: data.method,
          url: data.url,
          startTime: data.startTime,
          requestHeaders: data.requestHeaders,
          requestBody: data.requestBody,
        });
      }

      this.addEventListener('loadend', () => {
        const endTime = Date.now();
        const responseHeaders: Record<string, string> = {};

        const headerString = this.getAllResponseHeaders();
        if (headerString) {
          headerString.split('\r\n').forEach((line) => {
            const parts = line.split(': ');
            if (parts.length === 2) {
              responseHeaders[parts[0]] = parts[1];
            }
          });
        }

        let responseBody: unknown;
        try {
          if (!this.responseType || this.responseType === 'text') {
            const contentType = this.getResponseHeader('content-type') || '';
            if (contentType.includes('application/json')) {
              responseBody = JSON.parse(this.responseText);
            } else {
              responseBody = this.responseText;
            }
          } else {
            responseBody = `[${this.responseType}]`;
          }
        } catch {
          if (!this.responseType || this.responseType === 'text') {
            responseBody = this.responseText || '[Unable to parse response]';
          } else {
            responseBody = '[Unable to read response]';
          }
        }

        if (onRequestEnd) {
          onRequestEnd(data.id, {
            status: this.status,
            statusText: this.statusText,
            endTime,
            duration: endTime - data.startTime,
            responseHeaders,
            responseBody,
            error: this.status === 0 ? 'Network Error' : undefined,
          });
        }
      });
    }

    return originalXHRSend.call(this, body);
  };
}

export function startNetworkInterceptor(
  onStart: NetworkCallback,
  onEnd: NetworkUpdateCallback
): void {
  if (isIntercepting) return;

  onRequestStart = onStart;
  onRequestEnd = onEnd;
  isIntercepting = true;

  interceptFetch();
  interceptXHR();
}

export function stopNetworkInterceptor(): void {
  if (!isIntercepting) return;

  global.fetch = originalFetch;
  XMLHttpRequest.prototype.open = originalXHROpen;
  XMLHttpRequest.prototype.send = originalXHRSend;
  XMLHttpRequest.prototype.setRequestHeader = originalXHRSetRequestHeader;

  onRequestStart = null;
  onRequestEnd = null;
  isIntercepting = false;
}

export function isNetworkIntercepting(): boolean {
  return isIntercepting;
}
