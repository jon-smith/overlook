import React from 'react';
import styles from './logo.module.css';

const buildHexPoints = (radius: number, midX: number, midY: number) => {
	return [0, 1, 2, 3, 4, 5, 6]
		.map((n, i) => {
			const angleDeg = 60 * i - 30;
			const angleRad = (Math.PI / 180) * angleDeg;
			return [midX + radius * Math.cos(angleRad), midY + radius * Math.sin(angleRad)];
		})
		.map(p => p.join(','))
		.join(' ');
};

const SVGElements = (props: { size: number }) => {
	const { size } = props;
	const buildHex = (radius: number, color: string) => {
		const p = buildHexPoints(radius, size * 0.5, size * 0.5);
		return <polygon points={p} fill={color} />;
	};

	const outerSize = size * 0.5;

	return (
		<>
			{buildHex(outerSize, '#2e1c01')}
			{buildHex(outerSize * 0.85, '#ffb347')}
			{buildHex(outerSize * 0.65, '#2e1c01')}
			{buildHex(outerSize * 0.45, '#ff443a')}
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
	return (
		<svg width="100%" height="100%">
			<defs>
				<pattern id="pattern" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
					<SVGElements size={100} />
				</pattern>
			</defs>
			<rect x="0" y="0" width="100%" height="100%" fill="url(#pattern)" />
		</svg>
	);
};

export default Logo;
