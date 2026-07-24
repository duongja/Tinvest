type ErrorResponse = {
  error?: unknown;
};

export async function readJsonResponse<T>(response: Response): Promise<T> {
  const text = await response.text();

  if (!text.trim()) {
    throw new Error(response.ok ? "The service returned an empty response." : unavailableMessage(response));
  }

  try {
    return JSON.parse(text) as T;
  } catch {
    throw new Error(response.ok ? "The service returned an invalid response." : unavailableMessage(response));
  }
}

export function responseError(body: ErrorResponse, fallback: string): string {
  return typeof body.error === "string" && body.error ? body.error : fallback;
}

function unavailableMessage(response: Response): string {
  return response.status >= 500 ? "Tinvest services are temporarily unavailable." : `Request failed (${response.status}).`;
}
