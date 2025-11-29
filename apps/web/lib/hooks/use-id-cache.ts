import { useEffect, useState } from "react";

export function useIdCache<T extends { id: string; }>(data: T[] | undefined): Map<string, T> {
  const [cache, setCache] = useState<Map<string, T>>(new Map());

  useEffect(() => {
    if (data) {
      setCache((prev) => {
        const newCache = new Map(prev);
        data.forEach((item) => {
          newCache.set(item.id, item);
        });
        return newCache;
      });
    }
  }, [data]);

  return cache;
}

