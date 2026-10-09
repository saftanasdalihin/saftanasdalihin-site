import { Redis } from "@upstash/redis";

const redis = Redis.fromEnv();
const DEFAULT_TTL_SECONDS = 60 * 60 * 12;

export async function readProjectCache<T>(key: string): Promise<T | null> {
  try {
    return await redis.get<T>(key);
  } catch (error) {
    console.warn("Safta AI project cache read failed:", error);
    return null;
  }
}

export async function writeProjectCache<T>(
  key: string,
  value: T,
  ttlSeconds = DEFAULT_TTL_SECONDS
): Promise<void> {
  try {
    await redis.set(key, value, { ex: ttlSeconds });
  } catch (error) {
    console.warn("Safta AI project cache write failed:", error);
  }
}

export async function deleteProjectCache(...keys: string[]): Promise<void> {
  if (keys.length === 0) return;
  try {
    await redis.del(...keys);
  } catch (error) {
    console.warn("Safta AI project cache invalidation failed:", error);
  }
}

export async function acquireProjectRefreshPermit(): Promise<boolean> {
  try {
    const result = await redis.set(
      "safta-ai:project-index:refresh-lock",
      "1",
      { nx: true, ex: 300 }
    );
    return result === "OK";
  } catch (error) {
    console.warn("Safta AI refresh cooldown could not be checked:", error);
    return false;
  }
}

export const PROJECT_INDEX_CACHE_KEY = "safta-ai:project-index:v1";
export const REPOSITORY_LIST_CACHE_KEY = "safta-ai:repository-list:v1";

export function repositorySnapshotCacheKey(repositoryName: string, commitSha: string) {
  return "safta-ai:repository-snapshot:v1:" + repositoryName + ":" + commitSha;
}
