import { useEffect } from 'react';

export default function useRequestAnimationFrame(callback: () => void, deps: React.DependencyList) {
	useEffect(() => {
		const id = requestAnimationFrame(callback);
		return () => cancelAnimationFrame(id);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, deps);
}
