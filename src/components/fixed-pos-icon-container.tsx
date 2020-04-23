import React from 'react';
import { Icon } from '@iconify/react';

const FixedIconContainer = <T extends {}>(props: {
	icon: T;
	widthEm: number;
	hFlip?: boolean;
	yOffsetPc?: number;
	yOffsetEm?: number;
	xOffsetEm?: number;
}) => (
	<div
		style={{
			position: 'fixed',
			top: `calc(50% +  ${props.yOffsetPc ?? 0}% + ${props.yOffsetEm ?? 0}em)`,
			left: `${props.xOffsetEm ?? 0}em`,
			width: '100vw',
			transform: 'translateY(-50%)'
		}}
	>
		<Icon icon={props.icon} width={`${props.widthEm}em`} hFlip={props.hFlip} />
	</div>
);

export default FixedIconContainer;
