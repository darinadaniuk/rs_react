import { useEffect, useState, useCallback } from 'react';

interface ReadFromStorageOptions<T> {
  failoverValue: T;
}

export function useStorage<T>(
  key: string,
  options: ReadFromStorageOptions<T>,
  storageType: 'localStorage' | 'sessionStorage' = 'localStorage'
): [T, (newValue: T) => void] {
  const [value, setValue] = useState<T>(() => {
    const storage =
      storageType === 'localStorage' ? localStorage : sessionStorage;
    const item = storage.getItem(key);
    try {
      return item ? JSON.parse(item) : options.failoverValue;
    } catch {
      return options.failoverValue;
    }
  });

  useEffect(() => {
    const storage =
      storageType === 'localStorage' ? localStorage : sessionStorage;
    const item = storage.getItem(key);
    try {
      setValue(item ? JSON.parse(item) : options.failoverValue);
    } catch {
      setValue(options.failoverValue);
    }
  }, [key, options.failoverValue, storageType]);

  const updateValue = useCallback(
    (newValue: T) => {
      const storage =
        storageType === 'localStorage' ? localStorage : sessionStorage;
      try {
        storage.setItem(key, JSON.stringify(newValue));
        setValue(newValue);
      } catch {
        console.error('Failed to set to storage');
      }
    },
    [key, storageType]
  );

  return [value, updateValue];
}
