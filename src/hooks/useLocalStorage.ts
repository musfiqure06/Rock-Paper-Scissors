import { useEffect, useState } from 'react';

type Serializer<T> = (value: T) => string;
type Deserializer<T> = (value: string | null) => T;

const defaultSerializer: Serializer<unknown> = (value) => JSON.stringify(value);
const defaultDeserializer: Deserializer<unknown> = (value) =>
  value ? JSON.parse(value) : null;

export const useLocalStorage = <T,>(
  key: string,
  initialValue: T,
  serializer: Serializer<T> = defaultSerializer as Serializer<T>,
  deserializer: Deserializer<T> = defaultDeserializer as Deserializer<T>,
) => {
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') return initialValue;
    try {
      const item = window.localStorage.getItem(key);
      return item ? deserializer(item) : initialValue;
    } catch (error) {
      console.error('useLocalStorage error', error);
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      const serialized = serializer(storedValue);
      window.localStorage.setItem(key, serialized);
    } catch (error) {
      console.error('useLocalStorage error', error);
    }
  }, [key, storedValue, serializer]);

  return [storedValue, setStoredValue] as const;
};
