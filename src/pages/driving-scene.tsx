import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { useAsync } from '@react-hook/async';
import useInterval from 'hooks/use-interval';
import useStateWithTime from 'hooks/use-state-with-time';
import { useRequestAnimationFrameLoop } from 'hooks/use-request-animation-frame';
import { loadTiles, TilesT } from 'img/tiles';
import { loadSprites, SpritesT } from 'img/sprites';
import {
	CANVAS_HEIGHT,
	CANVAS_WIDTH,
	makeColumnDefinitions,
	SceneColumnDefinition
} from './driving-scene-columns';
import { drawScene } from './driving-scene-drawing';

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

function calculateLengths(distanceToHotel: number) {
	const STOP_LENGTH = 50;
	const FADE_LENGTH = 100;
	const totalSceneLength = distanceToHotel + STOP_LENGTH + FADE_LENGTH;
	const totalSceneLengthPlusFadeIn = totalSceneLength + FADE_LENGTH;
	return {
		STOP_LENGTH,
		FADE_LENGTH,
		totalSceneLength,
		totalSceneLengthPlusFadeIn
	};
}

function calculateProgressAlphaAndStage(
	progress: number,
	distanceToHotel: number
): {
	sceneProgressForDraw: number;
	alpha: number;
	stage: 'main' | 'hotel' | 'fadeout' | 'fadein';
} {
	const { STOP_LENGTH, FADE_LENGTH } = calculateLengths(distanceToHotel);

	if (progress < distanceToHotel)
		return { sceneProgressForDraw: progress, alpha: 1.0, stage: 'main' };

	if (progress < distanceToHotel + STOP_LENGTH)
		return { sceneProgressForDraw: distanceToHotel, alpha: 1.0, stage: 'hotel' };

	if (progress < distanceToHotel + STOP_LENGTH + FADE_LENGTH) {
		const intoFade = progress - (distanceToHotel + STOP_LENGTH);
		return {
			sceneProgressForDraw: distanceToHotel,
			alpha: 1.0 - intoFade / FADE_LENGTH,
			stage: 'fadeout'
		};
	}

	if (progress < distanceToHotel + STOP_LENGTH + FADE_LENGTH * 2) {
		const intoFade = progress - (distanceToHotel + STOP_LENGTH + FADE_LENGTH);
		return { sceneProgressForDraw: 0, alpha: intoFade / FADE_LENGTH, stage: 'fadein' };
	}

	return { sceneProgressForDraw: 0, alpha: 1.0, stage: 'main' };
}

type ImplProps = Props & {
	tiles: TilesT;
	sprites: SpritesT;
	columnDefinitions: readonly [SceneColumnDefinition, number][];
	distanceToHotel: number;
};

const DrivingSceneImpl = (props: ImplProps) => {
	const {
		className,
		style,
		tiles,
		sprites,
		distanceToHotel,
		columnDefinitions,
		onEndScene
	} = props;

	const { totalSceneLength, totalSceneLengthPlusFadeIn } = calculateLengths(distanceToHotel);

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
					setSceneProgress((number * distanceToHotel) / 9);
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
		if (sceneProgress < totalSceneLength && newProgress >= totalSceneLength) {
			onEndScene?.();
		}
		// Reset when we reach totalSceneProgress
		setSceneProgress(newProgress % totalSceneLengthPlusFadeIn);
	}, 1000 / 25);

	const { sceneProgressForDraw, alpha, stage } = calculateProgressAlphaAndStage(
		sceneProgress,
		distanceToHotel
	);

	const animationLoop = useCallback(() => {
		if (canvasRef.current) {
			const ctx = canvasRef.current.getContext('2d');
			if (ctx) {
				drawScene(
					ctx,
					columnDefinitions,
					tiles,
					sprites,
					sceneProgressForDraw,
					alpha,
					mode % 4 === 1,
					mode % 4 === 2,
					mode % 4 === 3
				);
			}
		}
	}, [sceneProgressForDraw, columnDefinitions, tiles, sprites, alpha, mode]);

	useRequestAnimationFrameLoop(animationLoop, true);

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

const DrivingScene = (props: Props) => {
	const [{ value: tiles }, callLoadTiles] = useAsync(loadTiles, []);
	const [{ value: sprites }, callLoadSprites] = useAsync(loadSprites, []);

	useEffect(
		() => {
			callLoadTiles();
			callLoadSprites();
		},
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[]
	);

	const columnDefs = useMemo(() => (tiles ? makeColumnDefinitions(tiles) : undefined), [tiles]);

	if (tiles && sprites && columnDefs)
		return (
			<DrivingSceneImpl
				tiles={tiles}
				sprites={sprites}
				columnDefinitions={columnDefs.columnsAndDuration}
				distanceToHotel={columnDefs.distanceToHotel}
				{...props}
			/>
		);

	return <div />;
};

export default DrivingScene;
