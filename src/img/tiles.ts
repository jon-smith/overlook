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
import { htmlImageFromSourceAsync as loadImage } from 'img/image-utils';

export async function loadTiles() {
	const tree = await loadImage(bigTreeTile);
	const smallTree = await loadImage(smallTreeTile);
	const grass = await loadImage(grassTile);
	const mudLight = await loadImage(mudLightTile);
	const shrubLight = await loadImage(shrubLightTile);
	const water = await loadImage(waterTile);
	const waterLeftEdge = await loadImage(waterLeftEdgeTile);
	const waterRightEdge = await loadImage(waterRightEdgeTile);
	const waterTopEdge = await loadImage(waterTopEdgeTile);
	const waterTopRightEdge = await loadImage(waterTopRightEdgeTile);
	const waterTopLeftEdge = await loadImage(waterTopLeftEdgeTile);
	const road = await loadImage(roadTile);
	const snowBoulder = await loadImage(snowBoulderTile);
	const snowGround = await loadImage(snowGroundTile);
	const snowGroundRocks = await loadImage(snowGroundRocksTile);
	const snowGrass = await loadImage(snowGrassTile);
	const snowStumpLeft = await loadImage(snowStumpLeftTile);
	const snowStumpRight = await loadImage(snowStumpRightTile);
	const hotel = await loadImage(overlookHotelTile);

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
