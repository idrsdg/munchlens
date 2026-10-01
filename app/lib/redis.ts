import Redis from "ioredis";

let redis: Redis | null = null;

function getRedis(): Redis {
  if (!redis) {
    redis = new Redis(process.env.REDIS_URL ?? "redis://localhost:6379", {
      maxRetriesPerRequest: 3,
      lazyConnect: true,
    });
    redis.on("error", (err) => {
      console.error("Redis error:", err);
    });
  }
  return redis;
}

export { getRedis };

// Rate limit: kullanıcı başına günlük limit
export async function checkRateLimit(
  userId: string,
  action: string,
  limit: number
): Promise<{ allowed: boolean; remaining: number; resetAt: Date }> {
  const client = getRedis();
  const today = new Date().toISOString().split("T")[0];
  const key = `rate:${userId}:${action}:${today}`;

  const current = await client.incr(key);
  if (current === 1) {
    // TTL: gün sonuna kadar
    const now = new Date();
    const midnight = new Date(now);
    midnight.setHours(24, 0, 0, 0);
    const ttl = Math.floor((midnight.getTime() - now.getTime()) / 1000);
    await client.expire(key, ttl);
  }

  const allowed = current <= limit;
  const remaining = Math.max(0, limit - current);
  const resetAt = new Date();
  resetAt.setHours(24, 0, 0, 0);

  return { allowed, remaining, resetAt };
}

// Cache: genel amaçlı
export async function getCache<T>(key: string): Promise<T | null> {
  const client = getRedis();
  const val = await client.get(key);
  if (!val) return null;
  return JSON.parse(val) as T;
}

export async function setCache(
  key: string,
  value: unknown,
  ttlSeconds = 3600
): Promise<void> {
  const client = getRedis();
  await client.setex(key, ttlSeconds, JSON.stringify(value));
}
