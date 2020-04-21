import bigTreeTile from 'img/tiles/tree_16x32.png';
import smallTreeTile from 'img/tiles/tree_16x16.png';
import grassTile from 'img/tiles/grass_16x16.png';
import roadTile from 'img/tiles/road_mark_16x16.png';
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
const roadImg = imgFromSource(roadTile);
const carImg1 = imgFromSource(carSprite1);
const carImg2 = imgFromSource(carSprite2);

const BLANK_ROWS = 6; // This needs to be tuned for the current parallax settings to get the canvas into the centre
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

const forestTop: AboveRoadDefinition = [
	[treeImg, 2],
	null,
	[treeImg, 2],
	null,
	[treeImg, 2],
	null,
	[treeImg, 2],
	null,
	[smallTreeImg, 1]
];

const forestBottom: BelowRoadDefinition = [
	[grassImg, 1],
	[smallTreeImg, 1],
	[treeImg, 2],
	null,
	[treeImg, 2],
	null,
	[treeImg, 2],
	null
];

const forestColumn: SceneColumnDefinition = [forestTop, forestBottom];

export function drawScene(ctx: CanvasRenderingContext2D, sceneProgress: number) {
	const offsetToUse = Math.floor(sceneProgress) % 16;

	ctx.save();
	ctx.translate(0, -CANVAS_HEIGHT / 2 + 16 * ABOVE_ROAD_ROWS);

	for (let c = -1; c < CANVAS_WIDTH / 16 + 1; c += 1) {
		ctx.save();
		ctx.translate(c * 16 - offsetToUse, 0);
		drawColumn(ctx, forestColumn);
		ctx.restore();
	}

	drawCar(ctx, sceneProgress);
	ctx.restore();
}
