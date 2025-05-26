import { useState, useEffect } from "react";
import StorageService from "../services/StorageService";
import type { StorageValues } from "../@types/StorageValues";

export default function useStorage<T extends keyof StorageValues>(key: T) {
  const [value, setValue] = useState<StorageValues[T] | null>(() => {
    return StorageService.getItem(key);
  });

  useEffect(() => {
    const handleStorage = (event: Event) => {
      const customEvent = event as CustomEvent<{ key: string }>;
      if (customEvent.detail.key === key) {
        const stored = StorageService.getItem(key);
        setValue(stored);
      }
    };

    window.addEventListener("local-storage-change", handleStorage);
    return () =>
      window.removeEventListener("local-storage-change", handleStorage);
  }, [key]);

  return [value] as const;
}
