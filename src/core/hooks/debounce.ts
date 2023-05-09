import { useCallback, useRef } from 'react';

interface UseDebounceOptions {
delay?: number;
}

type DebounceFunction = (callback: Function) => void;

export default function useDebounce({ delay = 1000 }: UseDebounceOptions = {}): DebounceFunction {
const timeoutRef = useRef<number>();

return useCallback((callback) => {
clearTimeout(timeoutRef.current);
timeoutRef.current = setTimeout(callback, delay);
}, [delay]);
}