import { useRef, useEffect } from 'react';

const useInterval = (callback: () => void, delay: number) => {
	const savedCallback = useRef<Function>();

	useEffect(() => {
		savedCallback.current = callback;
	}, [callback]);

	useEffect(() => {
		function tick() {
			if (savedCallback.current) savedCallback.current();
		}

		const id = setInterval(tick, delay);
		return () => clearInterval(id);
	}, [delay]);
};

export default useInterval;
