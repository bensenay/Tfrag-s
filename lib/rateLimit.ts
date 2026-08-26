import { Ratelimit, type Duration } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { NextResponse } from "next/server";

type RateLimitOptions = {
  identifier?: string | null;
  limit?: number;
  namespace: string;
  request: Request;
  window?: Duration;
};

const DEFAULT_LIMIT = 8;
const DEFAULT_WINDOW: Duration = "10 m";
const cache = new Map<string, number>();
const limiters = new Map<string, Ratelimit>();

const hasUpstashConfig = () =>
  Boolean(
    process.env.UPSTASH_REDIS_REST_URL &&
      process.env.UPSTASH_REDIS_REST_TOKEN,
  );

const getForwardedIp = (request: Request) => {
  const forwardedFor = request.headers.get("x-forwarded-for");

  if (forwardedFor) {
    return forwardedFor.split(",")[0]?.trim();
  }

  return request.headers.get("x-real-ip")?.trim();
};

const getLimiter = (
  namespace: string,
  limit: number = DEFAULT_LIMIT,
  window: Duration = DEFAULT_WINDOW,
) => {
  const key = `${namespace}:${limit}:${window}`;
  const existingLimiter = limiters.get(key);

  if (existingLimiter) {
    return existingLimiter;
  }

  const limiter = new Ratelimit({
    redis: Redis.fromEnv(),
    limiter: Ratelimit.slidingWindow(limit, window),
    prefix: `ratelimit:${namespace}`,
    ephemeralCache: cache,
  });

  limiters.set(key, limiter);

  return limiter;
};

export const checkRateLimit = async ({
  identifier,
  limit = DEFAULT_LIMIT,
  namespace,
  request,
  window = DEFAULT_WINDOW,
}: RateLimitOptions) => {
  if (!hasUpstashConfig()) {
    return {
      success: false,
      response: NextResponse.json(
        { error: "Missing Upstash Redis rate limit configuration" },
        { status: 500 },
      ),
    };
  }

  const resolvedIdentifier =
    identifier ?? getForwardedIp(request) ?? "anonymous";
  const limiter = getLimiter(namespace, limit, window);
  const result = await limiter.limit(resolvedIdentifier);

  const headers = {
    "X-RateLimit-Limit": result.limit.toString(),
    "X-RateLimit-Remaining": result.remaining.toString(),
    "X-RateLimit-Reset": result.reset.toString(),
  };

  if (!result.success) {
    return {
      success: false,
      response: NextResponse.json(
        { error: "Too many requests" },
        { status: 429, headers },
      ),
    };
  }

  return {
    success: true,
    headers,
  };
};
