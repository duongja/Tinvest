export type SwapLinkInput = {
  targetToken: string;
  fromToken?: string;
  fromAmount?: string;
  baseUrl?: string;
};

export function buildStonfiSwapLink(input: SwapLinkInput): string {
  const url = new URL(input.baseUrl ?? "https://app.ston.fi/swap");
  url.searchParams.set("chartVisible", "false");
  url.searchParams.set("ft", input.fromToken ?? "TON");
  url.searchParams.set("tt", input.targetToken);

  if (input.fromAmount) {
    url.searchParams.set("fa", JSON.stringify(input.fromAmount));
  }

  return url.toString();
}
