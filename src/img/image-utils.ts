export const htmlImageFromSource = (src: string) => {
	const img = new Image();
	img.src = src;
	return img;
};

export const htmlImageFromSourceAsync = (src: string) => {
	const promise = new Promise<HTMLImageElement>(resolve => {
		const img = new Image();
		img.onload = async () => {
			resolve(img);
		};
		img.src = src;
	});
	return promise;
};

// N.B. Not supported on Safari
export const imageBitmapFromSource = (src: string) => {
	const promise = new Promise<ImageBitmap>(resolve => {
		const img = new Image();
		img.onload = async () => {
			const bitmap = await createImageBitmap(img);
			resolve(bitmap);
		};
		img.src = src;
	});

	return promise;
};
