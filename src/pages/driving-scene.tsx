import React, { useEffect, useRef, useState } from 'react';
import bigTreeTile from 'img/tiles/tree_16x32.png';
import smallTreeTile from 'img/tiles/tree_16x16.png';
import grassTile from 'img/tiles/grass_16x16.png';
import roadTile from 'img/tiles/road_mark_16x16.png';
import carSprite1 from 'img/sprites/yellow_car_1_32x16.png';
import carSprite2 from 'img/sprites/yellow_car_2_32x16.png';
import useInterval from 'hooks/use-interval';
import useStateWithTime from 'hooks/use-state-with-time';

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
	width: number;
	height: number;
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
	const [offset, setOffset, setOffsetTime] = useStateWithTime(0, false);

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

	const { width, height } = props;

	useEffect(() => {
		if (canvasRef.current) {
			const ctx = canvasRef.current.getContext('2d');
			if (ctx) {
				const offsetToUse = parseFloat((offset % 16).toFixed(0));

				const drawRow = (
					img: CanvasImageSource,
					rIndex: number,
					nRows: number,
					imgDim: [number, number]
				) => {
					const startRow = rIndex * 16;
					const toRow = startRow + nRows * imgDim[1];
					for (let r = startRow; r < toRow; r += imgDim[1]) {
						for (let c = -16; c < width + 16; c += imgDim[0]) {
							ctx.drawImage(img, c - offsetToUse, r, imgDim[0], imgDim[1]);
						}
					}
					return toRow / 16;
				};

				let nextRow = drawRow(treeImg, 0, 4, [16, 32]);
				nextRow = drawRow(smallTreeImg, nextRow, 1, [16, 16]);

				const roadRow = nextRow;
				nextRow = drawRow(roadImg, nextRow, 1, [16, 16]);
				nextRow = drawRow(grassImg, nextRow, 1, [16, 16]);
				nextRow = drawRow(smallTreeImg, nextRow, 1, [16, 16]);
				drawRow(treeImg, nextRow, 3, [16, 32]);

				const carImg = offsetToUse % 8 > 4 ? carImg1 : carImg2;
				ctx.drawImage(carImg, width / 2, roadRow * 16, 32, 16);
			}
		}
	}, [width, height, offset]);

	useInterval(() => {
		if (!moving) {
			// Event if not moving, set the time so we update the time
			setOffset(offset);
			return;
		}

		const sinceLast = Date.now() - setOffsetTime;
		const speedToUse = clamp(speed, [5, 100]);
		const distance = speedToUse * sinceLast * 0.001;
		setOffset(offset + distance);
	}, 1000 / 25);

	return (
		<canvas
			ref={canvasRef}
			width={width}
			height={height}
			style={props.style}
			className={props.className}
		/>
	);
};

export default DrivingScene;
