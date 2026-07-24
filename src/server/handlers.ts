import { Prisma } from "@prisma/client";
import { z } from "zod";
import { env } from "../config/env.js";
import { logger } from "../config/logger.js";
import { prisma } from "../db/client.js";
import { AssetRepository } from "../repositories/assets.js";
import { ScoreRepository } from "../repositories/scores.js";
import { AiSwapCheckService } from "../services/ai-swap-check.js";
import { StonfiSwapService } from "../services/swap/stonfi-swap.js";

const swap = new StonfiSwapService(prisma);
const aiSwapCheck = new AiSwapCheckService(prisma);
const assets = new AssetRepository(prisma);
const scores = new ScoreRepository(prisma);

export const quoteSchema = z.object({
  token: z.string().min(1),
  amountTon: z.string().regex(/^\d+(\.\d+)?$/),
  slippageTolerance: z.string().regex(/^0(\.\d+)?$|^1(\.0+)?$/).optional()
});

const waitlistSchema = z.object({
  email: z.string().email().transform((value) => value.toLowerCase()),
  name: z.string().trim().max(80).optional(),
  source: z.string().trim().max(80).optional(),
  metadata: z.record(z.unknown()).optional()
});

export function configResponse() {
  return {
    manifestUrl: new URL("/tonconnect-manifest.json", env.MINI_APP_PUBLIC_URL).toString(),
    defaultSlippage: env.DEFAULT_SWAP_SLIPPAGE
  };
}

export function tonconnectManifestResponse() {
  return {
    url: env.MINI_APP_PUBLIC_URL,
    name: env.MINI_APP_NAME,
    iconUrl: env.MINI_APP_ICON_URL
  };
}

export async function assetResponse(query: string) {
  const asset = await assets.findAssetByQuery(query);
  if (!asset) {
    throw new ApiError(404, "Token not found");
  }

  const score = await scores.latestForAsset(asset.id);
  return {
    id: asset.id,
    symbol: asset.symbol,
    name: asset.name,
    decimals: asset.decimals,
    score: score
      ? {
          opportunityScore: score.opportunityScore,
          riskScore: score.riskScore,
          rank: score.rank
        }
      : null
  };
}

export async function swapQuoteResponse(body: unknown) {
  return swap.quote(quoteSchema.parse(body));
}

export async function swapTransactionResponse(body: unknown) {
  const input = quoteSchema
    .extend({
      walletAddress: z.string().min(30)
    })
    .parse(body);
  return swap.transaction(input);
}

export async function aiSwapCheckResponse(body: unknown) {
  return aiSwapCheck.create(quoteSchema.parse(body));
}

export async function waitlistResponse(body: unknown) {
  const input = waitlistSchema.parse(body);
  const metadata = input.metadata as Prisma.InputJsonValue | undefined;
  const entry = await prisma.waitlistEntry.upsert({
    where: { email: input.email },
    update: {
      name: input.name,
      source: input.source,
      metadata
    },
    create: {
      email: input.email,
      name: input.name,
      source: input.source,
      metadata
    }
  });

  return {
    ok: true,
    id: entry.id
  };
}

export class ApiError extends Error {
  constructor(
    readonly status: number,
    message: string
  ) {
    super(message);
  }
}

export function apiError(error: unknown): { status: number; body: { error: string } } {
  logger.warn({ error }, "request failed");

  if (error instanceof ApiError) {
    return { status: error.status, body: { error: error.message } };
  }

  if (error instanceof z.ZodError) {
    return { status: 400, body: { error: error.issues[0]?.message ?? "Invalid request" } };
  }

  if (
    error instanceof Prisma.PrismaClientInitializationError ||
    error instanceof Prisma.PrismaClientKnownRequestError ||
    error instanceof Prisma.PrismaClientUnknownRequestError
  ) {
    return { status: 503, body: { error: "The data service is temporarily unavailable." } };
  }

  return { status: 500, body: { error: "The service is temporarily unavailable." } };
}
