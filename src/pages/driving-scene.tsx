import React, { useEffect, useRef, useState } from 'react';
import bigTreeTile from 'img/tiles/tree_16x32.png';
import smallTreeTile from 'img/tiles/tree_16x16.png';
import grassTile from 'img/tiles/grass_16x16.png';
import roadTile from 'img/tiles/road_mark_16x16.png';
import carSprite1 from 'img/sprites/yellow_car_1_32x16.png';
import carSprite2 from 'img/sprites/yellow_car_2_32x16.png';
import useInterval from 'hooks/use-interval';
import useStateWithTime from 'hooks/use-state-with-time';
import { FixedLengthArray } from 'utils/array-utils';

const imgFromSource = (src: string) => {
	const img = new Image();
	img.src = src;
	return img;
};

const treeImg = imgFromSource(bigTreeTile);
const smallTreeImg = imgFromSource(smallTreeTile);
const grassImg = imgFromSource(grassTile);
const roadImg = imgFromSource(roadTile);
const carImg1 = imgFromSource(carSprite1);
const carImg2 = imgFromSource(carSprite2);

const BLANK_ROWS = 6;
const CONTENT_ROWS = 18;
const TOTAL_ROWS = BLANK_ROWS + CONTENT_ROWS;
const CANVAS_WIDTH = 500;
const CANVAS_HEIGHT = TOTAL_ROWS * 16;
type SceneColumnDefinition = FixedLengthArray<
	[HTMLImageElement, number] | null,
	typeof CONTENT_ROWS
>;

function drawColumn(ctx: CanvasRenderingContext2D, def: SceneColumnDefinition) {
	const drawCell = (img: CanvasImageSource, row: number, imgDim: [number, number]) => {
		const y = (row + BLANK_ROWS) * 16;
		ctx.drawImage(img, 0, y, imgDim[0], imgDim[1]);
	};
	def.forEach((cell, i) => {
		if (cell) drawCell(cell[0], i, [16, cell[1] * 16]);
	});
}

function drawCar(ctx: CanvasRenderingContext2D, sceneProgress: number) {
	const carImg = Math.floor(sceneProgress % 8) > 4 ? carImg1 : carImg2;
	ctx.drawImage(carImg, CANVAS_WIDTH / 2 - 8, (BLANK_ROWS + 9) * 16, 32, 16);
}

const forestColumn: SceneColumnDefinition = [
	[treeImg, 2],
	null,
	[treeImg, 2],
	null,
	[treeImg, 2],
	null,
	[treeImg, 2],
	null,
	[smallTreeImg, 1],
	[roadImg, 1],
	[grassImg, 1],
	[smallTreeImg, 1],
	[treeImg, 2],
	null,
	[treeImg, 2],
	null,
	[treeImg, 2],
	null
];

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

const DrivingScene = (props: Props) => {
	const canvasRef = useRef<HTMLCanvasElement>(null);

	const [moving, setMoving] = useState(true);
	const [speed, setSpeed] = useState(10); // pixels per second
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
			}
		}
	});

	useEffect(() => {
		if (canvasRef.current) {
			const ctx = canvasRef.current.getContext('2d');
			if (ctx) {
				const offsetToUse = Math.floor(sceneProgress) % 16;

				for (let c = -1; c < CANVAS_WIDTH / 16 + 1; c += 1) {
					ctx.save();
					ctx.translate(c * 16 - offsetToUse, 0);
					drawColumn(ctx, forestColumn);
					ctx.restore();
				}

				drawCar(ctx, sceneProgress);
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
