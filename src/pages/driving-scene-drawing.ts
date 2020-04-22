import bigTreeTile from 'img/tiles/tree_16x32.png';
import smallTreeTile from 'img/tiles/tree_16x16.png';
import grassTile from 'img/tiles/grass_16x16.png';
import mudLightTile from 'img/tiles/mud_light_16x16.png';
import shrubLightTile from 'img/tiles/shrub_light_16x16.png';
import roadTile from 'img/tiles/road_mark_16x16.png';
import waterTile from 'img/tiles/water_16x16.png';
import waterLeftEdgeTile from 'img/tiles/water_edge_left_16x16.png';
import waterRightEdgeTile from 'img/tiles/water_edge_right_16x16.png';
import waterTopEdgeTile from 'img/tiles/water_edge_top_16x16.png';
import waterTopRightEdgeTile from 'img/tiles/water_edge_top_right_16x16.png';
import waterTopLeftEdgeTile from 'img/tiles/water_edge_top_left_16x16.png';
import carSprite1 from 'img/sprites/yellow_car_1_32x16.png';
import carSprite2 from 'img/sprites/yellow_car_2_32x16.png';
import { FixedLengthArray } from 'utils/array-utils';

const imgFromSource = (src: string) => {
	const img = new Image();
	img.src = src;
	return img;
};

const treeImg = imgFromSource(bigTreeTile);
const smallTreeImg = imgFromSource(smallTreeTile);
const grassImg = imgFromSource(grassTile);
const mudLightImg = imgFromSource(mudLightTile);
const shrubLightImg = imgFromSource(shrubLightTile);
const waterImg = imgFromSource(waterTile);
const waterLeftEdgeImg = imgFromSource(waterLeftEdgeTile);
const waterRightImg = imgFromSource(waterRightEdgeTile);
const waterTopEdgeImg = imgFromSource(waterTopEdgeTile);
const waterTopRightEdgeImg = imgFromSource(waterTopRightEdgeTile);
const waterTopLeftEdgeImg = imgFromSource(waterTopLeftEdgeTile);
const roadImg = imgFromSource(roadTile);
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

	drawCell(roadImg, ABOVE_ROAD_ROWS, [16, 16]);

	def[1].forEach((cell, i) => {
		if (cell) drawCell(cell[0], i + 1 + ABOVE_ROAD_ROWS, [16, cell[1] * 16]);
	});
}

function drawCar(ctx: CanvasRenderingContext2D, sceneProgress: number) {
	const carImg = Math.floor(sceneProgress % 8) > 4 ? carImg1 : carImg2;
	ctx.drawImage(carImg, CANVAS_WIDTH / 2 - 8, (BLANK_ROWS + 9) * 16, 32, 16);
}

const forestTop = (roadside: HTMLImageElement): AboveRoadDefinition => [
	[treeImg, 2],
	null,
	[treeImg, 2],
	null,
	[treeImg, 2],
	null,
	[treeImg, 2],
	null,
	[roadside, 1]
];

const forestToLake = (
	roadside: [HTMLImageElement, HTMLImageElement, HTMLImageElement]
): AboveRoadDefinition => [
	[treeImg, 2],
	null,
	[treeImg, 2],
	null,
	[treeImg, 2],
	null,
	[roadside[0], 1],
	[roadside[1], 1],
	[roadside[2], 1]
];

const forestToLake1: AboveRoadDefinition = [
	[treeImg, 2],
	null,
	[treeImg, 2],
	null,
	[treeImg, 2],
	null,
	[treeImg, 2],
	null,
	[mudLightImg, 1]
];

const forestToLake2 = forestToLake([smallTreeImg, mudLightImg, mudLightImg]);
const forestToLake3 = forestToLake([mudLightImg, mudLightImg, mudLightImg]);

const forestToLake4: AboveRoadDefinition = [
	[waterLeftEdgeImg, 1],
	[waterLeftEdgeImg, 1],
	[waterLeftEdgeImg, 1],
	[waterLeftEdgeImg, 1],
	[mudLightImg, 1],
	[mudLightImg, 1],
	[mudLightImg, 1],
	[mudLightImg, 1],
	[mudLightImg, 1]
];

const lakeTop = (cutout?: HTMLImageElement): AboveRoadDefinition => [
	[waterImg, 1],
	[waterImg, 1],
	[waterImg, 1],
	[waterImg, 1],
	[cutout ?? mudLightImg, 1],
	[mudLightImg, 1],
	[mudLightImg, 1],
	[mudLightImg, 1],
	[mudLightImg, 1]
];

const lakeTopMountain = (edge1: HTMLImageElement, edge2: HTMLImageElement): AboveRoadDefinition => [
	[edge1, 1],
	[edge2, 1],
	[waterImg, 1],
	[waterImg, 1],
	[mudLightImg, 1],
	[mudLightImg, 1],
	[mudLightImg, 1],
	[mudLightImg, 1],
	[mudLightImg, 1]
];

const lakeTopMountainLeft = lakeTopMountain(waterRightImg, waterTopRightEdgeImg);
const lakeTopMountainMid = lakeTopMountain(mudLightImg, waterTopEdgeImg);
const lakeTopMountainRight = lakeTopMountain(waterLeftEdgeImg, waterTopLeftEdgeImg);

const forestBottom = (
	roadside: HTMLImageElement,
	roadside2?: HTMLImageElement
): BelowRoadDefinition => [
	[roadside, 1],
	[roadside2 ?? smallTreeImg, 1],
	[treeImg, 2],
	null,
	[treeImg, 2],
	null,
	[treeImg, 2],
	null
];

const columnsAndDuration: readonly [SceneColumnDefinition, number][] = [
	[[forestTop(smallTreeImg), forestBottom(grassImg)], 30],
	[[forestTop(grassImg), forestBottom(grassImg)], 1],
	[[forestTop(mudLightImg), forestBottom(grassImg)], 3],
	[[forestTop(grassImg), forestBottom(grassImg)], 1],
	[[forestTop(smallTreeImg), forestBottom(grassImg)], 2],
	[[forestTop(smallTreeImg), forestBottom(mudLightImg)], 3],
	[[forestTop(smallTreeImg), forestBottom(grassImg)], 1],
	[[forestTop(grassImg), forestBottom(grassImg)], 1],
	[[forestTop(shrubLightImg), forestBottom(grassImg)], 2],
	[[forestTop(grassImg), forestBottom(grassImg)], 1],
	[[forestTop(smallTreeImg), forestBottom(grassImg)], 6],
	// transition to lake
	[[forestTop(grassImg), forestBottom(grassImg)], 1],
	[[forestToLake1, forestBottom(grassImg)], 1],
	[[forestToLake2, forestBottom(grassImg)], 1],
	[[forestToLake3, forestBottom(grassImg)], 1],
	[[forestToLake4, forestBottom(grassImg)], 1],
	// Lake top
	[[lakeTop(), forestBottom(grassImg)], 5],
	[[lakeTop(waterLeftEdgeImg), forestBottom(grassImg)], 1],
	[[lakeTop(waterImg), forestBottom(grassImg)], 3],
	[[lakeTop(waterRightImg), forestBottom(mudLightImg)], 1],
	[[lakeTop(), forestBottom(mudLightImg)], 5],
	[[lakeTop(), forestBottom(mudLightImg, mudLightImg)], 5],
	[[lakeTopMountainLeft, forestBottom(mudLightImg, mudLightImg)], 1],
	[[lakeTopMountainMid, forestBottom(mudLightImg, mudLightImg)], 4],
	[[lakeTopMountainRight, forestBottom(mudLightImg, mudLightImg)], 1],
	[[lakeTop(), forestBottom(mudLightImg, mudLightImg)], 5]
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
