import React from 'react';
import { Icon } from '@iconify/react';

const FixedIconContainer = <T extends {}>(props: {
	icon: T;
	widthEm: number;
	hFlip?: boolean;
	bottomOffsetPc?: number;
	bottomOffsetEm?: number;
	leftOffsetEm?: number;
}) => (
	<div
		style={{
			position: 'fixed',
			bottom: `calc(${props.bottomOffsetPc ?? 0}vh + ${props.bottomOffsetEm ?? 0}em)`,
			left: `${props.leftOffsetEm ?? 0}em`,
			width: '100vw'
		}}
	>
		<Icon icon={props.icon} width={`${props.widthEm}em`} hFlip={props.hFlip} />
	</div>
);

export default FixedIconContainer;
