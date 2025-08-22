import { useEffect, useState, useCallback } from 'react';

interface ReadFromStorageOptions<T> {
  failoverValue: T;
}

export function useStorage<T>(
  key: string,
  options: ReadFromStorageOptions<T>,
  storageType: 'localStorage' | 'sessionStorage' = 'localStorage',
): [T, (newValue: T) => void] {
  const [value, setValue] = useState<T>(options.failoverValue);
  const isBrowser = typeof window !== 'undefined';

  useEffect(() => {
    if (!isBrowser) return;

    const storage = storageType === 'localStorage' ? window.localStorage : window.sessionStorage;
    const item = storage.getItem(key);

    try {
      setValue(item ? JSON.parse(item) : options.failoverValue);
    } catch {
      setValue(options.failoverValue);
    }
  }, [key, options.failoverValue, storageType, isBrowser]);

  const updateValue = useCallback(
    (newValue: T) => {
      if (!isBrowser) return;

      const storage = storageType === 'localStorage' ? window.localStorage : window.sessionStorage;
      try {
        storage.setItem(key, JSON.stringify(newValue));
        setValue(newValue);
      } catch {
        console.error('Failed to set to storage');
      }
    },
    [key, storageType, isBrowser],
  );

  return [value, updateValue];
}
