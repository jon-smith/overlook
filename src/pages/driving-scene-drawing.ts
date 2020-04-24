import seedrandom from 'seedrandom';
import { SpritesT } from 'img/sprites';
import { makeArray } from 'utils/array-utils';
import {
	drawSceneToCanvas,
	CANVAS_HEIGHT,
	CANVAS_WIDTH,
	SceneColumnDefinition
} from './driving-scene-columns';

function makeGreyscale(imageData: ImageData) {
	for (let i = 0; i < imageData.data.length; i += 4) {
		const luma = Math.floor(
			imageData.data[i] * 0.3 + imageData.data[i + 1] * 0.59 + imageData.data[i + 2] * 0.11
		);

		// eslint-disable-next-line no-param-reassign
		imageData.data[i] = luma;
		// eslint-disable-next-line no-param-reassign
		imageData.data[i + 1] = luma;
		// eslint-disable-next-line no-param-reassign
		imageData.data[i + 2] = luma;
	}
}

const noiseArray = makeArray(CANVAS_WIDTH * CANVAS_HEIGHT, () => ({
	x: Math.random(),
	y: Math.random(),
	z: Math.random(),
	w: Math.random()
}));

type Vec2 = { x: number; y: number };
type Vec4 = { x: number; y: number; z: number; w: number };

const rgbSplitBuffer = new Uint8ClampedArray(CANVAS_WIDTH * CANVAS_HEIGHT * 4);

function timeBasedRNG(timeSeconds: number, seedHz: number) {
	const seed = Math.floor(timeSeconds * seedHz);
	const rng = seedrandom(String(seed));

	const randomBetween = (from: number, to: number) => {
		const rand01 = rng();
		const range = to - from;
		return from + range * rand01;
	};

	return (from = 0, to = 1) => randomBetween(from, to);
}

function rgbSplitImage(imageData: ImageData, buffer: Uint8ClampedArray, t: number) {
	const { width, height } = imageData;

	if (buffer.length < width * height * 4) {
		console.error('rgbSplit buffer too small');
		return;
	}

	function getPixel(x: number, y: number, offset: number) {
		const index = Math.floor(y % height) * width + Math.floor(x % width);
		return imageData.data[Math.floor(index * 4) + offset] / 255.0;
	}

	const FPS = 10;
	const noiseIndex = Math.floor(t * FPS) % noiseArray.length;
	const noisePixel = noiseArray[noiseIndex];

	const shiftAmplitude = 10;

	function rgbShift(p: Vec2, shift: Vec4) {
		const shiftMulti = 2.0 * shift.w; // - 1.0;
		const shiftAdj = {
			x: shift.x * shiftMulti,
			y: shift.y * shiftMulti,
			z: shift.z * shiftMulti
		};

		const rs = { x: shiftAdj.x, y: -shiftAdj.y };
		const gs = { x: shiftAdj.y, y: -shiftAdj.z };
		const bs = { x: shiftAdj.z, y: -shiftAdj.x };

		const r = getPixel(p.x + rs.x, p.y + rs.y, 0);
		const g = getPixel(p.x + gs.x, p.y + gs.y, 1);
		const b = getPixel(p.x + bs.x, p.y + bs.y, 2);
		const a = getPixel(p.x, p.y, 3);

		return { r, g, b, a };
	}

	function amplifyNoise(v: Vec4, p: number) {
		return {
			x: shiftAmplitude * v.x ** p,
			y: shiftAmplitude * v.y ** p,
			z: shiftAmplitude * v.z ** p,
			w: v.w
		};
	}

	const shift = amplifyNoise(noisePixel, 8);

	for (let r = 0; r < height; ++r) {
		for (let c = 0; c < width; ++c) {
			const index = r * width + c;
			const pixelIndex = index * 4;

			const result = rgbShift({ x: c, y: r }, shift);

			// eslint-disable-next-line no-param-reassign
			buffer[pixelIndex] = result.r * 255;
			// eslint-disable-next-line no-param-reassign
			buffer[pixelIndex + 1] = result.g * 255;
			// eslint-disable-next-line no-param-reassign
			buffer[pixelIndex + 2] = result.b * 255;
			// eslint-disable-next-line no-param-reassign
			buffer[pixelIndex + 3] = result.a * 255;
		}
	}

	for (let i = 0; i < imageData.data.length; ++i) {
		// eslint-disable-next-line no-param-reassign
		imageData.data[i] = buffer[i];
	}
}

export function drawScene(
	ctx: CanvasRenderingContext2D,
	columnDefinitions: readonly SceneColumnDefinition[],
	sprites: SpritesT,
	sceneProgress: number,
	alpha: number,
	rgbSplit = false,
	rectRGBSplit = false,
	greyscale = false
) {
	ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
	ctx.globalAlpha = alpha;

	drawSceneToCanvas(ctx, columnDefinitions, sprites, sceneProgress);

	if (greyscale) {
		const imageData = ctx.getImageData(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
		makeGreyscale(imageData);
		ctx.putImageData(imageData, 0, 0);
	}

	if (rgbSplit) {
		const imageData = ctx.getImageData(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
		const now = new Date(Date.now());
		const t = now.getSeconds() + now.getMilliseconds() * 0.001;
		rgbSplitImage(imageData, rgbSplitBuffer, t);
		ctx.putImageData(imageData, 0, 0);
	}

	if (rectRGBSplit) {
		const now = new Date(Date.now());
		const t = now.getSeconds() + now.getMilliseconds() * 0.001;
		const genRandom = timeBasedRNG(t, 4);
		const random = genRandom();
		if (random < 0.3) {
			const getRandomRectImg = () => {
				const x = Math.floor(genRandom(0, CANVAS_WIDTH - 30));
				const y = Math.floor(genRandom(0, CANVAS_HEIGHT - 50));
				const w = Math.floor(genRandom(30, CANVAS_WIDTH - x));
				const h = Math.floor(genRandom(10, 20));
				return { x, y, w, h };
			};

			const nImages = Math.floor(genRandom(5, 10));
			const randomRects = makeArray(nImages, getRandomRectImg);

			randomRects.forEach(r => {
				const img = ctx.getImageData(r.x, r.y, r.w, r.h);
				rgbSplitImage(img, rgbSplitBuffer, t);

				const xOffset = Math.floor(genRandom(-5, 5));
				const yOffset = Math.floor(genRandom(-5, 5));

				ctx.putImageData(img, r.x + xOffset, r.y + yOffset);
			});
		}
	}
}
