import * as tile from 'img/tiles';
import * as sprite from 'img/sprites';
import { FixedLengthArray, makeArray } from 'utils/array-utils';

const BLANK_ROWS = 4; // This needs to be tuned for the current parallax settings to get the canvas into the centre
const ABOVE_ROAD_ROWS = 9;
const BELOW_ROAD_ROWS = 8;
export const CANVAS_WIDTH = 16 * 40;
export const CANVAS_HEIGHT = (BLANK_ROWS + ABOVE_ROAD_ROWS + BELOW_ROAD_ROWS) * 16;

type AboveRoadDefinition = FixedLengthArray<HTMLImageElement | null, typeof ABOVE_ROAD_ROWS>;

type BelowRoadDefinition = FixedLengthArray<HTMLImageElement | null, typeof BELOW_ROAD_ROWS>;

type SceneColumnDefinition = [AboveRoadDefinition, BelowRoadDefinition];

function drawColumn(ctx: CanvasRenderingContext2D, def: SceneColumnDefinition) {
	const drawCell = (img: CanvasImageSource, row: number) => {
		const { width, height } = img;
		const y = (row + BLANK_ROWS) * 16;
		ctx.drawImage(img, 0, y, width as number, height as number);
	};

	def[0].forEach((cell, i) => {
		if (cell) drawCell(cell, i);
	});

	drawCell(tile.road, ABOVE_ROAD_ROWS);

	def[1].forEach((cell, i) => {
		if (cell) {
			drawCell(cell, i + 1 + ABOVE_ROAD_ROWS);
		}
	});
}

function drawCar(ctx: CanvasRenderingContext2D, sceneProgress: number) {
	const carImg = Math.floor(sceneProgress % 8) > 4 ? sprite.car1 : sprite.car2;
	ctx.drawImage(carImg, CANVAS_WIDTH / 2 - 8, (BLANK_ROWS + 9) * 16, 32, 16);
}

const forestTop = (roadside: HTMLImageElement): AboveRoadDefinition => [
	tile.tree,
	null,
	tile.tree,
	null,
	tile.tree,
	null,
	tile.tree,
	null,
	roadside
];

const forestToLake = (
	roadside: [HTMLImageElement, HTMLImageElement, HTMLImageElement]
): AboveRoadDefinition => [
	tile.tree,
	null,
	tile.tree,
	null,
	tile.tree,
	null,
	roadside[0],
	roadside[1],
	roadside[2]
];

const forestToLake1: AboveRoadDefinition = [
	tile.tree,
	null,
	tile.tree,
	null,
	tile.tree,
	null,
	tile.tree,
	null,
	tile.mudLight
];

const forestToLake2 = forestToLake([tile.smallTree, tile.mudLight, tile.mudLight]);
const forestToLake3 = forestToLake([tile.mudLight, tile.mudLight, tile.mudLight]);

const forestToLake4: AboveRoadDefinition = [
	tile.waterLeftEdge,
	tile.waterLeftEdge,
	tile.waterLeftEdge,
	tile.waterLeftEdge,
	tile.mudLight,
	tile.mudLight,
	tile.mudLight,
	tile.mudLight,
	tile.mudLight
];

const lakeTop = (cutout?: HTMLImageElement): AboveRoadDefinition => [
	tile.water,
	tile.water,
	tile.water,
	tile.water,
	cutout ?? tile.mudLight,
	tile.mudLight,
	tile.mudLight,
	tile.mudLight,
	tile.mudLight
];

const lakeTopMountain = (edge1: HTMLImageElement, edge2: HTMLImageElement): AboveRoadDefinition => [
	edge1,
	edge2,
	tile.water,
	tile.water,
	tile.mudLight,
	tile.mudLight,
	tile.mudLight,
	tile.mudLight,
	tile.mudLight
];

const lakeTopMountainLeft = lakeTopMountain(tile.waterRightEdge, tile.waterTopRightEdge);
const lakeTopMountainMid = lakeTopMountain(tile.mudLight, tile.waterTopEdge);
const lakeTopMountainRight = lakeTopMountain(tile.waterLeftEdge, tile.waterTopLeftEdge);

const getLakeTopTransitionCell = (cell: number, nGround: number, nEdges: number) => {
	if (nGround > cell) return tile.mudLight;
	const offsetCell = cell - nGround;
	return nEdges > offsetCell ? tile.waterRightEdge : tile.water;
};

const lakeTopTransition = (nGround: number, nEdges: number): AboveRoadDefinition => [
	getLakeTopTransitionCell(3, nGround, nEdges),
	getLakeTopTransitionCell(2, nGround, nEdges),
	getLakeTopTransitionCell(1, nGround, nEdges),
	getLakeTopTransitionCell(0, nGround, nEdges),
	tile.mudLight,
	tile.mudLight,
	tile.mudLight,
	tile.mudLight,
	tile.mudLight
];

const getLakeTopTransition2Cell = (cell: number, nBoulders: number) => {
	if (cell < nBoulders) {
		if (cell < nBoulders - 3) {
			return cell === 0 ? tile.snowGround : tile.snowGrass;
		}
		return tile.snowBoulder;
	}

	return tile.mudLight;
};

const lakeTopTransition2 = (nBoulders: number): AboveRoadDefinition => [
	getLakeTopTransition2Cell(8, nBoulders),
	getLakeTopTransition2Cell(7, nBoulders),
	getLakeTopTransition2Cell(6, nBoulders),
	getLakeTopTransition2Cell(5, nBoulders),
	getLakeTopTransition2Cell(4, nBoulders),
	getLakeTopTransition2Cell(3, nBoulders),
	getLakeTopTransition2Cell(2, nBoulders),
	getLakeTopTransition2Cell(1, nBoulders),
	getLakeTopTransition2Cell(0, nBoulders)
];

const getSnowTopCell = (
	cell: number,
	includeTree: 'left' | 'right' | 'none',
	treePos: number
): HTMLImageElement | null => {
	if (includeTree !== 'none') {
		if (cell - 1 === treePos) {
			return null;
		}
		if (cell === treePos) {
			const img = includeTree === 'left' ? tile.snowStumpLeft : tile.snowStumpRight;
			return img;
		}
	}

	return tile.snowGrass;
};

const snowTop = (
	includeTree: 'left' | 'right' | 'none' = 'none',
	treePos = 0
): AboveRoadDefinition => [
	tile.snowBoulder,
	getSnowTopCell(0, includeTree, treePos),
	getSnowTopCell(1, includeTree, treePos),
	getSnowTopCell(2, includeTree, treePos),
	getSnowTopCell(3, includeTree, treePos),
	getSnowTopCell(4, includeTree, treePos),
	getSnowTopCell(5, includeTree, treePos),
	getSnowTopCell(6, includeTree, treePos),
	tile.snowGround
];

const overlookTop: AboveRoadDefinition = [
	tile.snowBoulder,
	tile.snowBoulder,
	tile.snowBoulder,
	tile.snowBoulder,
	tile.hotel,
	null,
	null,
	null,
	null
];

const overlookTop2: AboveRoadDefinition = [
	tile.snowBoulder,
	tile.snowBoulder,
	tile.snowBoulder,
	tile.snowBoulder,
	null,
	null,
	null,
	null,
	null
];

const afterOverlookTop: AboveRoadDefinition = [
	tile.snowBoulder,
	tile.snowBoulder,
	tile.snowBoulder,
	tile.snowBoulder,
	tile.snowGrass,
	tile.snowGrass,
	tile.snowGrass,
	tile.snowGrass,
	tile.snowGrass
];

const forestBottom = (
	roadside: HTMLImageElement,
	roadside2?: HTMLImageElement
): BelowRoadDefinition => [
	roadside,
	roadside2 ?? tile.smallTree,
	tile.tree,
	null,
	tile.tree,
	null,
	tile.tree,
	null
];

const getWinterBottomTransitionCell = (cell: number, stage: number): HTMLImageElement | null => {
	const imgForCell = (c: number) => {
		const offsetCell = c - 1;
		if (offsetCell < stage) return tile.snowBoulder;
		if (stage % 2 === 0 && offsetCell === stage) return tile.smallTree;
		return tile.tree;
	};
	// If the cell above is a large tree, this cell is null
	if (cell % 2 !== 0 && imgForCell(cell - 1) === tile.tree) return null;
	return imgForCell(cell);
};

const winterBottomTransition = (stage: number): BelowRoadDefinition => [
	tile.snowBoulder,
	getWinterBottomTransitionCell(1, stage),
	getWinterBottomTransitionCell(2, stage),
	getWinterBottomTransitionCell(3, stage),
	getWinterBottomTransitionCell(4, stage),
	getWinterBottomTransitionCell(5, stage),
	getWinterBottomTransitionCell(6, stage),
	getWinterBottomTransitionCell(7, stage)
];

const winterBottom: BelowRoadDefinition = [
	tile.snowGround,
	tile.snowGround,
	tile.snowGround,
	tile.snowGround,
	tile.snowGroundRocks,
	tile.snowGroundRocks,
	tile.snowGroundRocks,
	tile.snowGroundRocks
];

const columnsAndDuration: readonly [SceneColumnDefinition, number][] = [
	[[forestTop(tile.smallTree), forestBottom(tile.grass)], 25],
	[[forestTop(tile.grass), forestBottom(tile.grass)], 1],
	[[forestTop(tile.mudLight), forestBottom(tile.grass)], 3],
	[[forestTop(tile.grass), forestBottom(tile.grass)], 1],
	[[forestTop(tile.smallTree), forestBottom(tile.grass)], 2],
	[[forestTop(tile.smallTree), forestBottom(tile.mudLight)], 3],
	[[forestTop(tile.smallTree), forestBottom(tile.grass)], 1],
	[[forestTop(tile.grass), forestBottom(tile.grass)], 1],
	[[forestTop(tile.shrubLight), forestBottom(tile.grass)], 2],
	[[forestTop(tile.grass), forestBottom(tile.grass)], 1],
	[[forestTop(tile.smallTree), forestBottom(tile.grass)], 6],
	// transition to lake
	[[forestTop(tile.grass), forestBottom(tile.grass)], 1],
	[[forestToLake1, forestBottom(tile.grass)], 1],
	[[forestToLake2, forestBottom(tile.grass)], 1],
	[[forestToLake3, forestBottom(tile.grass)], 1],
	[[forestToLake4, forestBottom(tile.grass)], 1],
	// Lake top
	[[lakeTop(), forestBottom(tile.grass)], 4],
	[[lakeTop(tile.waterLeftEdge), forestBottom(tile.grass)], 1],
	[[lakeTop(tile.water), forestBottom(tile.grass)], 3],
	[[lakeTop(tile.waterRightEdge), forestBottom(tile.mudLight)], 1],
	[[lakeTop(), forestBottom(tile.mudLight)], 4],
	[[lakeTop(), forestBottom(tile.mudLight, tile.mudLight)], 4],
	[[lakeTopMountainLeft, forestBottom(tile.mudLight, tile.mudLight)], 1],
	[[lakeTopMountainMid, forestBottom(tile.mudLight, tile.mudLight)], 4],
	[[lakeTopMountainRight, forestBottom(tile.mudLight, tile.mudLight)], 1],
	[[lakeTop(), forestBottom(tile.mudLight, tile.mudLight)], 2],
	[[lakeTopTransition(0, 2), forestBottom(tile.mudLight, tile.mudLight)], 1],
	[[lakeTopTransition(2, 0), forestBottom(tile.mudLight, tile.mudLight)], 1],
	[[lakeTopTransition(2, 1), forestBottom(tile.mudLight, tile.mudLight)], 1],
	[[lakeTopTransition(3, 1), forestBottom(tile.mudLight, tile.smallTree)], 1],
	[[lakeTopTransition2(1), winterBottomTransition(0)], 1],
	[[lakeTopTransition2(2), winterBottomTransition(1)], 1],
	[[lakeTopTransition2(2), winterBottomTransition(3)], 1],
	[[lakeTopTransition2(4), winterBottomTransition(3)], 1],
	[[lakeTopTransition2(6), winterBottomTransition(4)], 1],
	[[lakeTopTransition2(8), winterBottom], 1],
	[[lakeTopTransition2(9), winterBottom], 1],
	[[snowTop('left', 2), winterBottom], 1],
	[[snowTop('right', 2), winterBottom], 1],
	[[snowTop(), winterBottom], 2],
	[[snowTop('left', 4), winterBottom], 1],
	[[snowTop('right', 4), winterBottom], 1],
	[[snowTop(), winterBottom], 1],
	[[snowTop('left', 1), winterBottom], 1],
	[[snowTop('right', 1), winterBottom], 1],
	[[snowTop(), winterBottom], 10],
	[[overlookTop, winterBottom], 1],
	[[overlookTop2, winterBottom], 11],
	[[afterOverlookTop, winterBottom], 20]
];

const TOTAL_COLUMNS = columnsAndDuration.map(c => c[1]).reduce((a, b) => a + b, 0);
export const DISTANCE_TO_HOTEL = (TOTAL_COLUMNS - 46) * 16;

function getColumn(index: number): SceneColumnDefinition | null {
	let cumulative = 0;
	for (let i = 0; i < columnsAndDuration.length; ++i) {
		cumulative += columnsAndDuration[i][1];
		if (index < cumulative) return columnsAndDuration[i][0];
	}
	return null;
}

const randomBetween = (from: number, to: number) => {
	const rand01 = Math.random();
	const range = to - from;
	return from + range * rand01;
};

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

function makeSingleColour(imageData: ImageData, c: 'r' | 'g' | 'b') {
	// makeGreyscale(imageData);
	for (let i = 0; i < imageData.data.length; i += 4) {
		// const luma = Math.floor(
		//	imageData.data[i] * 0.3 + imageData.data[i + 1] * 0.59 + imageData.data[i + 2] * 0.11
		// );

		if (c !== 'r')
			// eslint-disable-next-line no-param-reassign
			imageData.data[i] = 0.0;

		if (c !== 'g')
			// eslint-disable-next-line no-param-reassign
			imageData.data[i + 1] = 0.0;

		if (c !== 'b')
			// eslint-disable-next-line no-param-reassign
			imageData.data[i + 2] = 0.0;
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
	sceneProgress: number,
	alpha: number,
	rgbSplit = false,
	rectRGBSplit = false,
	greyscale = false
) {
	const columnOffset = Math.floor(sceneProgress) % 16;
	const columnIndex = Math.floor(sceneProgress / 16);
	ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
	ctx.globalAlpha = alpha;

	for (let c = -1; c < CANVAS_WIDTH / 16 + 1; c += 1) {
		const column = getColumn(columnIndex + c);
		if (column) {
			ctx.save();
			ctx.translate(c * 16 - columnOffset, 0.0);
			drawColumn(ctx, column);
			ctx.restore();
		}
	}

	drawCar(ctx, sceneProgress);

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
		const random = Math.random();
		if (random < 0.2) {
			const now = new Date(Date.now());
			const t = now.getSeconds() + now.getMilliseconds() * 0.001;

			const getRandomRectImg = () => {
				const x = Math.floor(randomBetween(0, CANVAS_WIDTH - 30));
				const y = Math.floor(randomBetween(0, CANVAS_HEIGHT - 50));
				const w = Math.floor(randomBetween(30, CANVAS_WIDTH - x));
				const h = Math.floor(randomBetween(10, 20));
				return { x, y, w, h };
			};

			const nImages = Math.floor(randomBetween(5, 10));
			const randomRects = makeArray(nImages, getRandomRectImg);

			randomRects.forEach(r => {
				const img = ctx.getImageData(r.x, r.y, r.w, r.h);
				rgbSplitImage(img, rgbSplitBuffer, t);

				const xOffset = Math.floor(randomBetween(-5, 5));
				const yOffset = Math.floor(randomBetween(-5, 5));

				ctx.putImageData(img, r.x + xOffset, r.y + yOffset);
			});
		}
	}
}
