import { describe, expect, it } from "vitest";
import { buildStonfiSwapLink } from "../src/stonfi/swap-link.js";

describe("buildStonfiSwapLink", () => {
  it("builds a STON.fi swap URL from TON to the target token", () => {
    const url = new URL(buildStonfiSwapLink({ targetToken: "EQ_TOKEN" }));

    expect(url.origin + url.pathname).toBe("https://app.ston.fi/swap");
    expect(url.searchParams.get("chartVisible")).toBe("false");
    expect(url.searchParams.get("ft")).toBe("TON");
    expect(url.searchParams.get("tt")).toBe("EQ_TOKEN");
  });

  it("optionally includes a quoted from amount understood by STON.fi shared links", () => {
    const url = new URL(buildStonfiSwapLink({ targetToken: "EQ_TOKEN", fromAmount: "1.5" }));

    expect(url.searchParams.get("fa")).toBe("\"1.5\"");
  });
});
