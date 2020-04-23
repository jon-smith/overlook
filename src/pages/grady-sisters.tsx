import React, { useRef, useState, useEffect, useCallback } from 'react';
import useWindowScroll from '@react-hook/window-scroll';
import girlLightSkinTone from '@iconify/icons-twemoji/girl-light-skin-tone';
import useInterval from 'hooks/use-interval';
import useStateWithTime from 'hooks/use-state-with-time';
import FixedIconContainer from 'components/fixed-pos-icon-container';

const elementInWithinYRange = (element: HTMLDivElement, fromP: number, toP: number) => {
	const { top } = element.getBoundingClientRect();
	return top >= window.innerHeight * fromP && top <= window.innerHeight * toP;
};

const elementPassedCentre = (element: HTMLDivElement) => {
	const { top, bottom } = element.getBoundingClientRect();

	const centre = (top + bottom) * 0.5;
	const windowCentre = window.innerHeight * 0.5;
	return windowCentre > 0 && centre < windowCentre;
};

const GradySisters = () => {
	const divRef = useRef<HTMLDivElement>(null);

	const scrollPos = useWindowScroll(10);

	const [hasDisplayedOnce, setHasDisplayedOnce] = useState(false);
	const [display, setDisplay, lastSet] = useStateWithTime(false);

	const doUpdate = useCallback(
		(doRandomDisplay: boolean) => {
			if (!divRef.current) return;

			const isInRange = elementInWithinYRange(divRef.current, 0.2, 0.8);
			const hasPassedCentre = elementPassedCentre(divRef.current);

			if (!isInRange) {
				setDisplay(false);
			} else if (!hasDisplayedOnce) {
				if (hasPassedCentre) {
					setDisplay(true);
					setHasDisplayedOnce(true);
				}
			} else if (display) {
				if (Date.now() - lastSet > 700) setDisplay(false);
			} else if (doRandomDisplay) {
				const randomValue = Math.random();
				const randomDisplay = randomValue < 0.01;
				setDisplay(isInRange && randomDisplay);
			}
		},
		[display, hasDisplayedOnce, lastSet, setDisplay]
	);

	useEffect(() => {
		doUpdate(true);
	}, [scrollPos, doUpdate]);

	useInterval(() => {
		doUpdate(false);
	}, 100);

	return (
		<div ref={divRef}>
			{display && (
				<>
					<FixedIconContainer icon={girlLightSkinTone} widthEm={5} xOffsetEm={-2.5} />
					<FixedIconContainer icon={girlLightSkinTone} widthEm={5} xOffsetEm={2.5} />
					<div
						style={{
							position: 'fixed',
							top: '50%',
							left: '50%',
							transform: 'translate(-50%, -50%)',
							fontFamily: 'consolas',
							color: 'black'
						}}
					>
						COME PLAY WITH US
					</div>
				</>
			)}
		</div>
	);
};

export default GradySisters;
