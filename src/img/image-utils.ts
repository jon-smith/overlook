export const htmlImageFromSource = (src: string) => {
	const img = new Image();
	img.src = src;
	return img;
};
