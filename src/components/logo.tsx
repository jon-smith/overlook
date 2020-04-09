import React from 'react';

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

const Logo = () => {
	const dimension = 100;

	const buildHex = (radius: number, color: string) => {
		const p = buildHexPoints(radius, dimension * 0.5, dimension * 0.5);
		return <polygon points={p} fill={color} />;
	};

	const outerSize = dimension * 0.4;

	return (
		<svg className="App-logo" viewBox={`0 0 ${dimension} ${dimension}`}>
			{buildHex(outerSize, '#2e1c01')}
			{buildHex(outerSize * 0.85, '#ffb347')}
			{buildHex(outerSize * 0.65, '#2e1c01')}
			{buildHex(outerSize * 0.45, '#ff443a')}
		</svg>
	);
};

export default Logo;
