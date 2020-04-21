import React, { useRef, useEffect, useState } from 'react';
import { useWindowScroll } from '@react-hook/window-scroll';

interface Props {
	scrollFps?: number;
	onEnterYRange?: () => void;
	onLeaveYRange?: () => void;
}

const elementInWithinYRange = (element: HTMLDivElement) => {
	const { top, bottom } = element.getBoundingClientRect();
	return bottom > 0 && top < window.innerHeight;
};

// Div with callbacks when it enters/leaves the y-scroll view
const DivWithOnYScrollEnter = (
	props: React.PropsWithChildren<Props & React.ComponentProps<'div'>>
) => {
	const { children, scrollFps, onEnterYRange, onLeaveYRange, ...rest } = props;

	const divRef = useRef<HTMLDivElement>(null);
	const scrollPos = useWindowScroll(scrollFps);
	const [inYRange, setInYRange] = useState(false);

	useEffect(() => {
		if (divRef.current) setInYRange(elementInWithinYRange(divRef.current));
	}, [scrollPos]);

	useEffect(() => {
		if (inYRange) {
			onEnterYRange?.();
		} else {
			onLeaveYRange?.();
		}
	}, [inYRange, onEnterYRange, onLeaveYRange]);

	return (
		<div ref={divRef} {...rest}>
			{children}
		</div>
	);
};

export default DivWithOnYScrollEnter;
