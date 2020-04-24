import { useRef, useCallback, useEffect, useLayoutEffect } from 'react';

export function useRequestAnimationFrame(callback: () => void, deps: React.DependencyList) {
	useEffect(() => {
		const id = requestAnimationFrame(callback);
		return () => cancelAnimationFrame(id);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, deps);
}

export function useRequestAnimationFrameLoop(callback: () => void, running: boolean) {
	const callbackRef = useRef<() => void>(callback);
	useLayoutEffect(() => {
		callbackRef.current = callback;
	}, [callback]);

	const frameRef = useRef<number>(0);

	const loop = useCallback(() => {
		frameRef.current = requestAnimationFrame(loop);
		callbackRef.current();
	}, []);

	useLayoutEffect(() => {
		frameRef.current = running ? requestAnimationFrame(loop) : 0;
		return () => cancelAnimationFrame(frameRef.current);
	}, [loop, running]);
}
