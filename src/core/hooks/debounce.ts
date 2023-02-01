import { useCallback, useRef } from 'react';

interface UseDebounce {
  delay?: number;
}

type Debouncer = (cb: Function) => void;

export default function useDebounce({
  delay = 1000,
}: UseDebounce = {}): Debouncer {
  const ref = useRef<number>();

  return useCallback((cb) => {
    clearTimeout(ref.current);
    ref.current = setTimeout(cb, delay);
  }, []);
}
