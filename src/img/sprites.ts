import carSprite1 from 'img/sprites/yellow_car_1_32x16.png';
import carSprite2 from 'img/sprites/yellow_car_2_32x16.png';
import { htmlImageFromSourceAsync as loadImage } from 'img/image-utils';

export const loadSprites = async () => {
	const car1 = await loadImage(carSprite1);
	const car2 = await loadImage(carSprite2);
	return { car1, car2 };
};

type ExtractPromiseType<P> = P extends Promise<infer T> ? T : never;

export type SpritesT = ExtractPromiseType<ReturnType<typeof loadSprites>>;
