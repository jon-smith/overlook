import React, { useState } from 'react';
import DivWithOnYScrollEnter from './div-on-scroll-to-visible';

interface Props {
	scrollFps?: number;
}

// Div that hides the content when it has scrolled out of y-range
const DivAutoHideContent = (
	props: React.PropsWithChildren<Props & React.ComponentProps<'div'>>
) => {
	const { children, ...rest } = props;

	const [show, setShow] = useState(false);

	return (
		<DivWithOnYScrollEnter
			onLeaveYRange={() => setShow(false)}
			onEnterYRange={() => setShow(true)}
			{...rest}
		>
			{show && children}
		</DivWithOnYScrollEnter>
	);
};

export default DivAutoHideContent;
