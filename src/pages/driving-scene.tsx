import React, { useEffect, useRef, useState, useCallback } from 'react';
import useInterval from 'hooks/use-interval';
import useStateWithTime from 'hooks/use-state-with-time';
import {
	useRequestAnimationFrame,
	useRequestAnimationFrameLoop
} from 'hooks/use-request-animation-frame';
import { CANVAS_HEIGHT, CANVAS_WIDTH, DISTANCE_TO_HOTEL, drawScene } from './driving-scene-drawing';

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
	onEndScene?: () => void;
}

const LEFT_ARROW = 37;
const RIGHT_ARROW = 39;
const SPACE_BAR = 32;
const ENTER = 13;

const convertNumberKeyCodeToNumber = (keyCode: number): number | null => {
	// 0-9 keys
	if (keyCode >= 48 && keyCode <= 57) return keyCode - 48;

	// Numpad
	if (keyCode >= 96 && keyCode <= 105) return keyCode - 96;

	return null;
};

const PROGRESS_VALUE_OUTSIDE_HOTEL = DISTANCE_TO_HOTEL;
const STOP_LENGTH = 50;
const FADE_LENGTH = 100;
const TOTAL_SCENE_LENGTH = PROGRESS_VALUE_OUTSIDE_HOTEL + STOP_LENGTH + FADE_LENGTH;
const TOTAL_SCENE_LENGTH_PLUS_FADE_IN = TOTAL_SCENE_LENGTH + FADE_LENGTH;

function calculateProgressAlphaAndStage(
	progress: number
): {
	sceneProgressForDraw: number;
	alpha: number;
	stage: 'main' | 'hotel' | 'fadeout' | 'fadein';
} {
	if (progress < PROGRESS_VALUE_OUTSIDE_HOTEL)
		return { sceneProgressForDraw: progress, alpha: 1.0, stage: 'main' };

	if (progress < PROGRESS_VALUE_OUTSIDE_HOTEL + STOP_LENGTH)
		return { sceneProgressForDraw: PROGRESS_VALUE_OUTSIDE_HOTEL, alpha: 1.0, stage: 'hotel' };

	if (progress < PROGRESS_VALUE_OUTSIDE_HOTEL + STOP_LENGTH + FADE_LENGTH) {
		const intoFade = progress - (PROGRESS_VALUE_OUTSIDE_HOTEL + STOP_LENGTH);
		return {
			sceneProgressForDraw: PROGRESS_VALUE_OUTSIDE_HOTEL,
			alpha: 1.0 - intoFade / FADE_LENGTH,
			stage: 'fadeout'
		};
	}

	if (progress < PROGRESS_VALUE_OUTSIDE_HOTEL + STOP_LENGTH + FADE_LENGTH * 2) {
		const intoFade = progress - (PROGRESS_VALUE_OUTSIDE_HOTEL + STOP_LENGTH + FADE_LENGTH);
		return { sceneProgressForDraw: 0, alpha: intoFade / FADE_LENGTH, stage: 'fadein' };
	}

	return { sceneProgressForDraw: 0, alpha: 1.0, stage: 'main' };
}

const DrivingScene = (props: Props) => {
	const { className, style, onEndScene } = props;

	const canvasRef = useRef<HTMLCanvasElement>(null);

	const [moving, setMoving] = useState(true);
	const [mode, setMode] = useState(0);
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
			} else if (keyCode === ENTER) {
				setMode(mode + 1);
			} else {
				const number = convertNumberKeyCodeToNumber(keyCode);
				if (number !== null) {
					setSceneProgress((number * DISTANCE_TO_HOTEL) / 9);
				}
			}
		}
	});

	useInterval(() => {
		if (!moving) {
			// Even if not moving, set the time so we update the time
			setSceneProgress(sceneProgress);
			return;
		}

		const sinceLast = Date.now() - setProgressTime;
		const speedToUse = clamp(speed, [5, 100]);
		const distance = speedToUse * sinceLast * 0.001;
		const newProgress = sceneProgress + distance;
		if (sceneProgress < TOTAL_SCENE_LENGTH && newProgress >= TOTAL_SCENE_LENGTH) {
			onEndScene?.();
		}
		// Reset when we reach totalSceneProgress
		setSceneProgress(newProgress % TOTAL_SCENE_LENGTH_PLUS_FADE_IN);
	}, 1000 / 25);

	const { sceneProgressForDraw, alpha, stage } = calculateProgressAlphaAndStage(sceneProgress);

	const animationLoop = useCallback(() => {
		if (canvasRef.current) {
			const ctx = canvasRef.current.getContext('2d');
			if (ctx) {
				drawScene(ctx, sceneProgressForDraw, alpha, mode % 4 === 1, mode % 4 === 2, mode % 4 === 3);
			}
		}
	}, [sceneProgressForDraw, alpha, mode]);

	useRequestAnimationFrameLoop(animationLoop, moving);

	return (
		<canvas
			ref={canvasRef}
			width={CANVAS_WIDTH}
			height={CANVAS_HEIGHT}
			style={style}
			className={className}
		/>
	);
};

export default DrivingScene;
