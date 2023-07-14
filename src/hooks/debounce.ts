import { useEffect, useMemo, useRef } from "react";
import debounce from "lodash.debounce";

const useDebounce = <R extends () => void>(callback: R, delay?: number) => {
    const ref = useRef<R>();

    useEffect(() => {
        ref.current = callback;
    }, [callback]);

    const debouncedCallback = useMemo(() => {
        const func = () => {
            ref.current?.();
        };

        return debounce(func, delay || 500);
    }, [delay]);

    return debouncedCallback;
}

export default useDebounce;
