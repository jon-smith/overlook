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
import snowBoulderTile from 'img/tiles/snow_boulder_16x16.png';
import snowGroundTile from 'img/tiles/snow_ground_16x16.png';
import snowGroundRocksTile from 'img/tiles/snow_ground_rocks_16x16.png';
import snowGrassTile from 'img/tiles/snow_grass_16x16.png';
import snowStumpLeftTile from 'img/tiles/snow_stump_left_16x32.png';
import snowStumpRightTile from 'img/tiles/snow_stump_right_16x32.png';
import overlookHotelTile from 'img/tiles/overlook_hotel_192x80.png';
import { imageBitmapFromSource } from 'img/image-utils';

export async function loadTiles() {
	const tree = await imageBitmapFromSource(bigTreeTile);
	const smallTree = await imageBitmapFromSource(smallTreeTile);
	const grass = await imageBitmapFromSource(grassTile);
	const mudLight = await imageBitmapFromSource(mudLightTile);
	const shrubLight = await imageBitmapFromSource(shrubLightTile);
	const water = await imageBitmapFromSource(waterTile);
	const waterLeftEdge = await imageBitmapFromSource(waterLeftEdgeTile);
	const waterRightEdge = await imageBitmapFromSource(waterRightEdgeTile);
	const waterTopEdge = await imageBitmapFromSource(waterTopEdgeTile);
	const waterTopRightEdge = await imageBitmapFromSource(waterTopRightEdgeTile);
	const waterTopLeftEdge = await imageBitmapFromSource(waterTopLeftEdgeTile);
	const road = await imageBitmapFromSource(roadTile);
	const snowBoulder = await imageBitmapFromSource(snowBoulderTile);
	const snowGround = await imageBitmapFromSource(snowGroundTile);
	const snowGroundRocks = await imageBitmapFromSource(snowGroundRocksTile);
	const snowGrass = await imageBitmapFromSource(snowGrassTile);
	const snowStumpLeft = await imageBitmapFromSource(snowStumpLeftTile);
	const snowStumpRight = await imageBitmapFromSource(snowStumpRightTile);
	const hotel = await imageBitmapFromSource(overlookHotelTile);

	return {
		tree,
		smallTree,
		grass,
		mudLight,
		shrubLight,
		water,
		waterLeftEdge,
		waterRightEdge,
		waterTopEdge,
		waterTopRightEdge,
		waterTopLeftEdge,
		road,
		snowBoulder,
		snowGround,
		snowGroundRocks,
		snowGrass,
		snowStumpLeft,
		snowStumpRight,
		hotel
	};
}

type ExtractPromiseType<P> = P extends Promise<infer T> ? T : never;

export type TilesT = ExtractPromiseType<ReturnType<typeof loadTiles>>;
