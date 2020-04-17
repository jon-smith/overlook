import { useRef, useLayoutEffect } from 'react';

const isBrowser = typeof window !== `undefined`;

function getScrollPosition(element: HTMLElement | null, useWindow: boolean) {
	if (!isBrowser) return { x: 0, y: 0 };

	const target = element ?? document.body;
	const position = target.getBoundingClientRect();

	return useWindow
		? { x: window.scrollX, y: window.scrollY }
		: { x: position.left, y: position.top };
}

type Pos = { x: number; y: number };

export function useScrollPosition(
	effect: (input: Partial<{ prevPos: Pos; currPos: Pos }>) => void,
	deps: React.DependencyList,
	element: HTMLElement | null,
	useWindow: boolean,
	wait?: number
) {
	const position = useRef(getScrollPosition(null, useWindow));

	const throttleTimeout = useRef<NodeJS.Timeout | null>(null);

	const callBack = () => {
		const currPos = getScrollPosition(element, useWindow);
		effect({ prevPos: position.current, currPos });
		position.current = currPos;
		throttleTimeout.current = null;
	};

	useLayoutEffect(() => {
		const handleScroll = () => {
			if (wait) {
				if (throttleTimeout.current === null) {
					throttleTimeout.current = setTimeout(callBack, wait);
				}
			} else {
				callBack();
			}
		};

		window.addEventListener('scroll', handleScroll);

		return () => window.removeEventListener('scroll', handleScroll);
	}, [callBack, wait]);
}
