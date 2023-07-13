import { useEffect, useCallback, type DependencyList } from 'react';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function useDebounceEffect(effect: any, deps: DependencyList, delay = 250) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const callback = useCallback(effect, deps);

    useEffect(() => {
        // eslint-disable-next-line @typescript-eslint/no-implied-eval, @typescript-eslint/no-unsafe-argument
        const timeout = setTimeout(callback, delay);
        return () => clearTimeout(timeout);
    }, [callback, delay]);
}

export default useDebounceEffect;
