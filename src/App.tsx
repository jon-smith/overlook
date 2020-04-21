import React, { useState } from 'react';
import { Parallax, Background } from 'react-parallax';
import { useWindowSize } from '@react-hook/window-size';
import Logo, { LogoBackground } from 'components/logo';
import NoiseCanvas from 'components/noise-canvas';
import DivAutoHideContent from 'components/div-auto-hide-content';
import background from 'img/stmarylake.jpg';
import styles from 'app.module.scss';
import glitchStyles from 'glitch.module.scss';
import DoorScene from 'pages/door-scene';
import GradySisters from 'pages/grady-sisters';
import DrivingScene from 'pages/driving-scene';
import Typewriter from 'pages/typewriter-scene';
import DivWithOnYScrollEnter from 'components/div-on-scroll-to-visible';

const FourPageNoiseCanvas = () => {
	const [width, height] = useWindowSize(undefined, undefined, { wait: 500 });
	return (
		<NoiseCanvas
			width={width}
			height={height * 4}
			className={styles.vh4}
			style={{ position: 'absolute', left: 0, top: 0 }}
		/>
	);
};

const DrivingSceneFullScreen = () => {
	return <DrivingScene className={styles.drivingSceneCanvas} />;
};

const convertDoorScenePercentage = (percentage: number) => {
	// The start percentage depends on the height of the div in the current parallax section
	const startP = 0.375;
	return (percentage - startP) / (1 - startP);
};

const scrollToId = (id: string) => {
	const anchor = document.querySelector(`#${id}`);
	if (anchor) anchor.scrollIntoView({ behavior: 'smooth', block: 'end' });
};

type NavID = 'top' | 'driving' | 'door-scene' | 'typewriter' | 'bottom' | 'carpet' | 'ice-cream';

const navDivProps = (clickId: NavID) => {
	return {
		onClick: () => scrollToId(clickId),
		role: 'button'
	};
};

const ArrowNav = (props: { clickId: NavID; type: 'up' | 'down' }) => {
	const [fadeIn, setFadeIn] = useState(false);
	const arrowName = props.type === 'up' ? styles.arrowUp : styles.arrowDown;
	const className = `${arrowName} ${fadeIn ? styles.fadeIn : ''}`;
	return (
		<DivWithOnYScrollEnter
			className={className}
			scrollFps={100}
			onEnterYRange={() => setFadeIn(true)}
			onLeaveYRange={() => setFadeIn(false)}
			{...navDivProps(props.clickId)}
		/>
	);
};

function App() {
	return (
		<div className={styles.app}>
			<Parallax
				blur={{ min: -3, max: 5 }}
				bgImage={background}
				bgImageAlt="background"
				bgImageStyle={{ opacity: '0.7' }}
				strength={100}
			>
				<div className={styles.appPage} id="top">
					<Logo />
					WELCOME TO THE
					<div className={glitchStyles.glitch} data-text="OVERLOOK">
						OVERLOOK
					</div>
					HOTEL
					<ArrowNav clickId="driving" type="down" />
				</div>
			</Parallax>
			<Parallax strength={200}>
				<div className={`${styles.appPage} ${styles.vh1point2}`} id="driving" />
				<div className={styles.overlayArrowContainerPlus10vh}>
					<ArrowNav clickId="typewriter" type="down" />
				</div>
				<Background className={`${styles.vh1point2}`}>
					<DrivingSceneFullScreen />
				</Background>
			</Parallax>
			<Parallax strength={500}>
				<div
					className={`${styles.appPage} ${styles.vh1point5}`}
					id="carpet"
					{...navDivProps('typewriter')}
				>
					<GradySisters />
				</div>
				<Background className={styles.vh2}>
					<LogoBackground />
				</Background>
			</Parallax>
			<Parallax strength={400}>
				<div className={styles.appPage} id="typewriter">
					<Typewriter />
				</div>
				<div className={styles.overlayArrowContainer}>
					<ArrowNav clickId="door-scene" type="down" />
				</div>
			</Parallax>
			<Parallax
				bgImage="dummy"
				strength={0}
				renderLayer={percentage => (
					<>
						<FourPageNoiseCanvas />
						<DivAutoHideContent className={`${styles.appPage} ${styles.vh4}`} id="door-scene">
							<DoorScene percentage={convertDoorScenePercentage(percentage)} />
						</DivAutoHideContent>
						<div className={`${styles.appPage} ${styles.vh4} ${styles.vignette}`} />
					</>
				)}
			/>
			<div className={styles.appPage}>
				<span className={styles.calligraphy}>fin</span>
				<ArrowNav clickId="top" type="up" />
			</div>
		</div>
	);
}

export default App;
