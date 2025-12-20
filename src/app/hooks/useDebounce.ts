import { useEffect, useState } from 'react';

/**
 * Hook para debouncing - Otimiza performance reduzindo chamadas excessivas
 * Útil para inputs de busca, scroll events, resize events, etc.
 */
export function useDebounce<T>(value: T, delay: number = 500): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // Set timeout para atualizar o valor após o delay
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Cleanup: cancela o timeout se o valor mudar antes do delay
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}
