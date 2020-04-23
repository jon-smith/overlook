import React, { useEffect, useRef, useState } from 'react';
import useInterval from 'hooks/use-interval';
import useStateWithTime from 'hooks/use-state-with-time';
import { CANVAS_HEIGHT, CANVAS_WIDTH, drawScene } from './driving-scene-drawing';

const elementIsWithinYRange = (element: Element) => {
	const { top, bottom } = element.getBoundingClientRect();
	return bottom > 0 && top < window.innerHeight;
};

const clamp = (value: number, range: [number, number]) =>
	Math.max(range[0], Math.min(value, range[1]));

const useWindowKeyDown = (handler: (e: KeyboardEvent) => void) => {
	const savedHandler = useRef(handler);

	useEffect(() => {
		savedHandler.current = handler;
	}, [handler]);

	useEffect(() => {
		const eventListener = (event: KeyboardEvent) => savedHandler.current(event);

		window.addEventListener('keydown', eventListener);

		return () => {
			window.removeEventListener('keydown', eventListener);
		};
	});
};

interface Props {
	className?: string;
	style?: React.CSSProperties;
}

const LEFT_ARROW = 37;
const RIGHT_ARROW = 39;
const SPACE_BAR = 32;

const convertNumberKeyCodeToNumber = (keyCode: number): number | null => {
	// 0-9 keys
	if (keyCode >= 48 && keyCode <= 57) return keyCode - 48;

	// Numpad
	if (keyCode >= 96 && keyCode <= 105) return keyCode - 96;

	return null;
};

const DrivingScene = (props: Props) => {
	const canvasRef = useRef<HTMLCanvasElement>(null);

	const [moving, setMoving] = useState(true);
	const [speed, setSpeed] = useState(20); // pixels per second
	const [sceneProgress, setSceneProgress, setProgressTime] = useStateWithTime(0, false);

	useWindowKeyDown((e: KeyboardEvent) => {
		if (canvasRef.current && elementIsWithinYRange(canvasRef.current)) {
			const { keyCode } = e;
			if (keyCode === LEFT_ARROW) {
				setSpeed(speed - 1);
			} else if (keyCode === RIGHT_ARROW) {
				setSpeed(speed + 1);
			} else if (keyCode === SPACE_BAR) {
				if (e.target === document.body) {
					setMoving(!moving);
					e.preventDefault();
				}
			} else {
				const number = convertNumberKeyCodeToNumber(keyCode);
				if (number !== null) {
					setSceneProgress(number * 24 * 16);
				}
			}
		}
	});

	useEffect(() => {
		if (canvasRef.current) {
			const ctx = canvasRef.current.getContext('2d');
			if (ctx) {
				drawScene(ctx, Math.min(1620, sceneProgress));
			}
		}
	}, [sceneProgress]);

	useInterval(() => {
		if (!moving) {
			// Even if not moving, set the time so we update the time
			setSceneProgress(sceneProgress);
			return;
		}

		const sinceLast = Date.now() - setProgressTime;
		const speedToUse = clamp(speed, [5, 100]);
		const distance = speedToUse * sinceLast * 0.001;
		setSceneProgress(sceneProgress + distance);
	}, 1000 / 25);

	return (
		<canvas
			ref={canvasRef}
			width={CANVAS_WIDTH}
			height={CANVAS_HEIGHT}
			style={props.style}
			className={props.className}
		/>
	);
};

export default DrivingScene;
