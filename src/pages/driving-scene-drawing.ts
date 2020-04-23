import carSprite1 from 'img/sprites/yellow_car_1_32x16.png';
import carSprite2 from 'img/sprites/yellow_car_2_32x16.png';
import { htmlImageFromSource as imgFromSource } from 'img/image-utils';
import * as tile from 'img/tiles';
import { FixedLengthArray } from 'utils/array-utils';

const carImg1 = imgFromSource(carSprite1);
const carImg2 = imgFromSource(carSprite2);

const BLANK_ROWS = 4; // This needs to be tuned for the current parallax settings to get the canvas into the centre
const ABOVE_ROAD_ROWS = 9;
const BELOW_ROAD_ROWS = 8;
export const CANVAS_WIDTH = 600;
export const CANVAS_HEIGHT = (BLANK_ROWS + ABOVE_ROAD_ROWS + BELOW_ROAD_ROWS) * 16;

type AboveRoadDefinition = FixedLengthArray<
	[HTMLImageElement, number] | null,
	typeof ABOVE_ROAD_ROWS
>;

type BelowRoadDefinition = FixedLengthArray<
	[HTMLImageElement, number] | null,
	typeof BELOW_ROAD_ROWS
>;

type SceneColumnDefinition = [AboveRoadDefinition, BelowRoadDefinition];

function drawColumn(ctx: CanvasRenderingContext2D, def: SceneColumnDefinition) {
	const drawCell = (img: CanvasImageSource, row: number, imgDim: [number, number]) => {
		const y = (row + BLANK_ROWS) * 16;
		ctx.drawImage(img, 0, y, imgDim[0], imgDim[1]);
	};

	def[0].forEach((cell, i) => {
		if (cell) drawCell(cell[0], i, [16, cell[1] * 16]);
	});

	drawCell(tile.road, ABOVE_ROAD_ROWS, [16, 16]);

	def[1].forEach((cell, i) => {
		if (cell) drawCell(cell[0], i + 1 + ABOVE_ROAD_ROWS, [16, cell[1] * 16]);
	});
}

function drawCar(ctx: CanvasRenderingContext2D, sceneProgress: number) {
	const carImg = Math.floor(sceneProgress % 8) > 4 ? carImg1 : carImg2;
	ctx.drawImage(carImg, CANVAS_WIDTH / 2 - 8, (BLANK_ROWS + 9) * 16, 32, 16);
}

const forestTop = (roadside: HTMLImageElement): AboveRoadDefinition => [
	[tile.tree, 2],
	null,
	[tile.tree, 2],
	null,
	[tile.tree, 2],
	null,
	[tile.tree, 2],
	null,
	[roadside, 1]
];

const forestToLake = (
	roadside: [HTMLImageElement, HTMLImageElement, HTMLImageElement]
): AboveRoadDefinition => [
	[tile.tree, 2],
	null,
	[tile.tree, 2],
	null,
	[tile.tree, 2],
	null,
	[roadside[0], 1],
	[roadside[1], 1],
	[roadside[2], 1]
];

const forestToLake1: AboveRoadDefinition = [
	[tile.tree, 2],
	null,
	[tile.tree, 2],
	null,
	[tile.tree, 2],
	null,
	[tile.tree, 2],
	null,
	[tile.mudLight, 1]
];

const forestToLake2 = forestToLake([tile.smallTree, tile.mudLight, tile.mudLight]);
const forestToLake3 = forestToLake([tile.mudLight, tile.mudLight, tile.mudLight]);

const forestToLake4: AboveRoadDefinition = [
	[tile.waterLeftEdge, 1],
	[tile.waterLeftEdge, 1],
	[tile.waterLeftEdge, 1],
	[tile.waterLeftEdge, 1],
	[tile.mudLight, 1],
	[tile.mudLight, 1],
	[tile.mudLight, 1],
	[tile.mudLight, 1],
	[tile.mudLight, 1]
];

const lakeTop = (cutout?: HTMLImageElement): AboveRoadDefinition => [
	[tile.water, 1],
	[tile.water, 1],
	[tile.water, 1],
	[tile.water, 1],
	[cutout ?? tile.mudLight, 1],
	[tile.mudLight, 1],
	[tile.mudLight, 1],
	[tile.mudLight, 1],
	[tile.mudLight, 1]
];

const lakeTopMountain = (edge1: HTMLImageElement, edge2: HTMLImageElement): AboveRoadDefinition => [
	[edge1, 1],
	[edge2, 1],
	[tile.water, 1],
	[tile.water, 1],
	[tile.mudLight, 1],
	[tile.mudLight, 1],
	[tile.mudLight, 1],
	[tile.mudLight, 1],
	[tile.mudLight, 1]
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
	[getLakeTopTransitionCell(3, nGround, nEdges), 1],
	[getLakeTopTransitionCell(2, nGround, nEdges), 1],
	[getLakeTopTransitionCell(1, nGround, nEdges), 1],
	[getLakeTopTransitionCell(0, nGround, nEdges), 1],
	[tile.mudLight, 1],
	[tile.mudLight, 1],
	[tile.mudLight, 1],
	[tile.mudLight, 1],
	[tile.mudLight, 1]
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
	[getLakeTopTransition2Cell(8, nBoulders), 1],
	[getLakeTopTransition2Cell(7, nBoulders), 1],
	[getLakeTopTransition2Cell(6, nBoulders), 1],
	[getLakeTopTransition2Cell(5, nBoulders), 1],
	[getLakeTopTransition2Cell(4, nBoulders), 1],
	[getLakeTopTransition2Cell(3, nBoulders), 1],
	[getLakeTopTransition2Cell(2, nBoulders), 1],
	[getLakeTopTransition2Cell(1, nBoulders), 1],
	[getLakeTopTransition2Cell(0, nBoulders), 1]
];

const getSnowTopCell = (
	cell: number,
	includeTree: 'left' | 'right' | 'none',
	treePos: number
): [HTMLImageElement, number] | null => {
	if (includeTree !== 'none') {
		if (cell - 1 === treePos) {
			return null;
		}
		if (cell === treePos) {
			const img = includeTree === 'left' ? tile.snowStumpLeft : tile.snowStumpRight;
			return [img, 2];
		}
	}

	return [tile.snowGrass, 1];
};

const snowTop = (
	includeTree: 'left' | 'right' | 'none' = 'none',
	treePos = 0
): AboveRoadDefinition => [
	[tile.snowBoulder, 1],
	getSnowTopCell(0, includeTree, treePos),
	getSnowTopCell(1, includeTree, treePos),
	getSnowTopCell(2, includeTree, treePos),
	getSnowTopCell(3, includeTree, treePos),
	getSnowTopCell(4, includeTree, treePos),
	getSnowTopCell(5, includeTree, treePos),
	getSnowTopCell(6, includeTree, treePos),
	[tile.snowGround, 1]
];

const forestBottom = (
	roadside: HTMLImageElement,
	roadside2?: HTMLImageElement
): BelowRoadDefinition => [
	[roadside, 1],
	[roadside2 ?? tile.smallTree, 1],
	[tile.tree, 2],
	null,
	[tile.tree, 2],
	null,
	[tile.tree, 2],
	null
];

const getWinterBottomTransitionCell = (
	cell: number,
	stage: number
): [HTMLImageElement, number] | null => {
	const imgForCell = (c: number) => {
		const offsetCell = c - 1;
		if (offsetCell < stage) return tile.snowBoulder;
		if (stage % 2 === 0 && offsetCell === stage) return tile.smallTree;
		return tile.tree;
	};
	// If the cell above is a large tree, this cell is null
	if (cell % 2 !== 0 && imgForCell(cell - 1) === tile.tree) return null;
	const thisCellImg = imgForCell(cell);
	return [thisCellImg, thisCellImg === tile.tree ? 2 : 1];
};

const winterBottomTransition = (stage: number): BelowRoadDefinition => [
	[tile.snowBoulder, 1],
	getWinterBottomTransitionCell(1, stage),
	getWinterBottomTransitionCell(2, stage),
	getWinterBottomTransitionCell(3, stage),
	getWinterBottomTransitionCell(4, stage),
	getWinterBottomTransitionCell(5, stage),
	getWinterBottomTransitionCell(6, stage),
	getWinterBottomTransitionCell(7, stage)
];

const winterBottom: BelowRoadDefinition = [
	[tile.snowGround, 1],
	[tile.snowGround, 1],
	[tile.snowGround, 1],
	[tile.snowGround, 1],
	[tile.snowGroundRocks, 1],
	[tile.snowGroundRocks, 1],
	[tile.snowGroundRocks, 1],
	[tile.snowGroundRocks, 1]
];

const columnsAndDuration: readonly [SceneColumnDefinition, number][] = [
	[[forestTop(tile.smallTree), forestBottom(tile.grass)], 30],
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
	[[lakeTop(), forestBottom(tile.grass)], 5],
	[[lakeTop(tile.waterLeftEdge), forestBottom(tile.grass)], 1],
	[[lakeTop(tile.water), forestBottom(tile.grass)], 3],
	[[lakeTop(tile.waterRightEdge), forestBottom(tile.mudLight)], 1],
	[[lakeTop(), forestBottom(tile.mudLight)], 5],
	[[lakeTop(), forestBottom(tile.mudLight, tile.mudLight)], 5],
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
	[[snowTop(), winterBottom], 10]
];

function getColumn(index: number): SceneColumnDefinition | null {
	let cumulative = 0;
	for (let i = 0; i < columnsAndDuration.length; ++i) {
		cumulative += columnsAndDuration[i][1];
		if (index < cumulative) return columnsAndDuration[i][0];
	}
	return null;
}

export function drawScene(ctx: CanvasRenderingContext2D, sceneProgress: number) {
	const columnOffset = Math.floor(sceneProgress) % 16;
	const columnIndex = Math.floor(sceneProgress / 16);

	ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

	for (let c = -1; c < CANVAS_WIDTH / 16 + 1; c += 1) {
		const column = getColumn(columnIndex + c);
		if (column) {
			ctx.save();
			ctx.translate(c * 16 - columnOffset, 0);
			drawColumn(ctx, column);
			ctx.restore();
		}
	}

	drawCar(ctx, sceneProgress);
}
