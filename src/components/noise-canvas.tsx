import React, { useEffect, useRef } from 'react';
import useInterval from '../hooks/use-interval';

const createNoise = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
	const idata = ctx.createImageData(width, height);
	const buffer32 = new Uint32Array(idata.data.buffer);
	const len = buffer32.length;

	for (let i = 0; i < len; i++) {
		if (Math.random() < 0.3) {
			buffer32[i] = 0xff222222;
		}
	}

	return idata;
};

interface Props {
	width: number;
	height: number;
	className?: string;
	style?: React.CSSProperties;
}

const NoiseCanvas = (props: Props) => {
	const canvasRef = useRef<HTMLCanvasElement>(null);

	const noiseFrames = useRef<ImageData[]>([]);
	const currentFrame = useRef<number>(0);

	const { width, height } = props;

	useEffect(() => {
		if (canvasRef.current) {
			const ctx = canvasRef.current.getContext('2d');
			if (ctx) {
				noiseFrames.current = Array(10)
					.fill(0)
					.map(() => createNoise(ctx, width, height));
			}
		}
	}, [width, height]);

	useInterval(() => {
		if (noiseFrames.current.length === 0) return;

		currentFrame.current =
			currentFrame.current === noiseFrames.current.length - 1 ? 0 : currentFrame.current + 1;

		if (canvasRef.current) {
			const ctx = canvasRef.current.getContext('2d');
			if (ctx) {
				ctx.putImageData(noiseFrames.current[currentFrame.current], 0, 0);
			}
		}
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

export default NoiseCanvas;
