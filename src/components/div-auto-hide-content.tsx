import React, { useRef, useEffect, useState } from 'react';
import { useWindowScroll } from '@react-hook/window-scroll';

interface Props {
	scrollFps?: number;
}

const elementInWithinYRange = (element: HTMLDivElement) => {
	const { top, bottom } = element.getBoundingClientRect();
	return bottom > 0 && top < window.innerHeight;
};

// Div that hides the content when it has scrolled out of y-range
const DivAutoHideContent = (
	props: React.PropsWithChildren<Props & React.ComponentProps<'div'>>
) => {
	const { children, scrollFps, ...rest } = props;

	const divRef = useRef<HTMLDivElement>(null);
	const scrollPos = useWindowScroll(scrollFps);
	const [show, setShow] = useState(false);
	useEffect(() => {
		if (divRef.current) setShow(elementInWithinYRange(divRef.current));
	}, [scrollPos]);

	return (
		<div ref={divRef} {...rest}>
			{show && children}
		</div>
	);
};

export default DivAutoHideContent;
