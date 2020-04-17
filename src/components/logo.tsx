import React from 'react';
import styles from './logo.module.css';

const logoMainDark = '#2e1c01';
const logoBackgroundDark = 'black';
const logoOrange = '#ffb347';
const logoRed = '#ff443a';

const hexPointFromEdgeIndex = (
	index: number,
	radius: number,
	midX: number,
	midY: number
): [number, number] => {
	const angleDeg = 60 * index - 30;
	const angleRad = (Math.PI / 180) * angleDeg;
	return [midX + radius * Math.cos(angleRad), midY + radius * Math.sin(angleRad)];
};

const buildHexPoints = (radius: number, midX: number, midY: number): [number, number][] => {
	return [0, 1, 2, 3, 4, 5, 6].map((n, i) => hexPointFromEdgeIndex(i, radius, midX, midY));
};

const pointsToString = (points: [number, number][]) => points.map(p => p.join(',')).join(' ');

const buildHexPointsString = (radius: number, midX: number, midY: number) => {
	return pointsToString(buildHexPoints(radius, midX, midY));
};

const SVGElements = (props: { size: number }) => {
	const { size } = props;
	const buildHex = (radius: number, color: string) => {
		const p = buildHexPointsString(radius, size * 0.5, size * 0.5);
		return <polygon points={p} fill={color} />;
	};

	const outerSize = size * 0.5;

	return (
		<>
			{buildHex(outerSize, logoMainDark)}
			{buildHex(outerSize * 0.8, logoOrange)}
			{buildHex(outerSize * 0.6, logoMainDark)}
			{buildHex(outerSize * 0.4, logoRed)}
		</>
	);
};

const hexMinorToMajorDimension = (w: number) => (w * 2) / Math.sqrt(3);

const BackgroundSVGElements = (props: { width: number }) => {
	const { width } = props;

	const hexWidth = (width * 8) / 7;
	const lineThickness = hexWidth / 8;
	const hexRad = hexMinorToMajorDimension(hexWidth) * 0.5;

	const buildMainLogo = (centreX: number, centreY: number, includeOuter: boolean) => {
		const buildHex = (radius: number, color: string) => {
			const p = buildHexPointsString(radius, centreX, centreY);
			return <polygon points={p} fill={color} />;
		};
		return (
			<>
				{includeOuter && buildHex(hexRad, logoBackgroundDark)}
				{buildHex(hexRad * 0.75, logoOrange)}
				{buildHex(hexRad * 0.5, logoBackgroundDark)}
				{buildHex(hexRad * 0.25, logoRed)}
			</>
		);
	};

	const buildFillLine = (centreX: number, top: number) => {
		const x = centreX - lineThickness * 0.5;
		return <rect x={x} y={top} width={lineThickness} height={hexRad} fill={logoBackgroundDark} />;
	};

	const hOffset = hexRad * 0.75;
	const vOffset = hexRad * 0.82;

	const topX = width * 0.5;
	const topY = width * 0.5;

	const leftX = topX - hOffset;
	const leftY = topY + vOffset;
	const topLeftY = leftY - 2.6 * vOffset;

	const rightX = topX + hOffset;
	const rightY = leftY;
	const topRightY = topLeftY;

	const bottomX = topX;
	const bottomY = topY + vOffset * 2;

	return (
		<>
			{buildMainLogo(topX, topY, true)}
			{buildMainLogo(leftX, leftY, false)}
			{buildMainLogo(rightX, rightY, false)}
			{buildMainLogo(leftX, topLeftY, false)}
			{buildMainLogo(rightX, topRightY, false)}
			{buildMainLogo(bottomX, bottomY, false)}
			{buildFillLine(topX, topY + hexRad * 0.25)}
			{buildFillLine(leftX, leftY - 1.25 * hexRad)}
			{buildFillLine(rightX, rightY - 1.25 * hexRad)}
		</>
	);
};

export const Logo = () => {
	// All measurements done relative to this number, but it doesn't appear to matter what this number is
	// But don't really want to hardccode the numbers below in case there becomes a need to change it
	const dimension = 1;

	return (
		<svg className={styles.logo} viewBox={`0 0 ${dimension} ${dimension}`}>
			<SVGElements size={dimension} />
		</svg>
	);
};

export const LogoBackground = () => {
	const width = 30;
	const height = width * 1.41;
	return (
		<svg width="100%" height="100%">
			<defs>
				<pattern
					id="pattern"
					x="0"
					y="0"
					width={width}
					height={height}
					patternUnits="userSpaceOnUse"
				>
					<BackgroundSVGElements width={width} />
				</pattern>
			</defs>
			<rect x="0" y="0" width="100%" height="100%" fill="url(#pattern)" />
		</svg>
	);
};

export default Logo;
