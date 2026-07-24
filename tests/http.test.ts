import { describe, expect, it } from "vitest";
import { readJsonResponse, responseError } from "../miniapp/src/http.js";

describe("HTTP response handling", () => {
  it("parses JSON responses", async () => {
    const response = new Response(JSON.stringify({ ok: true }), {
      headers: { "content-type": "application/json" }
    });

    await expect(readJsonResponse<{ ok: boolean }>(response)).resolves.toEqual({ ok: true });
  });

  it("reports an unavailable service for an empty server error", async () => {
    const response = new Response(null, { status: 502 });

    await expect(readJsonResponse(response)).rejects.toThrow("Tinvest services are temporarily unavailable.");
  });

  it("uses a fallback when an error body has no message", () => {
    expect(responseError({}, "Quote failed")).toBe("Quote failed");
  });
});
