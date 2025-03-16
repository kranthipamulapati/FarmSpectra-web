import { useEffect, DependencyList } from "react";

type AsyncEffectCleanup = void | (() => void);
type AsyncEffectCallback = (signal: AbortSignal) => Promise<AsyncEffectCleanup>;
type ErrorHandler = (error: unknown) => void;

function useAsyncEffect(
    effect: AsyncEffectCallback,
    deps: DependencyList = [],
    onError?: ErrorHandler
) {
    useEffect(() => {
        const controller = new AbortController();
        const signal = controller.signal;

        let cleanup: AsyncEffectCleanup | undefined;

        const executeEffect = async () => {
            try {
                cleanup = await effect(signal);
            } catch (error) {
                if (!signal.aborted && onError) {
                    onError(error);
                }
            }
        };

        executeEffect();

        return () => {
            controller.abort();

            if (typeof cleanup === "function") {
                cleanup();
            }
        };
    }, deps);
}

export default useAsyncEffect;
