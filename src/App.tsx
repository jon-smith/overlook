import React from 'react';
import { Parallax, Background } from 'react-parallax';
import { useWindowSize } from '@react-hook/window-size';
import Logo, { LogoBackground } from 'components/logo';
import NoiseCanvas from 'components/noise-canvas';
import DivAutoHideContent from 'components/div-auto-hide-content';
import background from 'img/background1.jpg';
import { Counter } from 'features/counter/Counter';
import styles from 'app.module.scss';
import glitchStyles from 'glitch.module.scss';
import DoorScene from 'pages/door-scene';
import GradySisters from 'pages/grady-sisters';
import DrivingScene from 'pages/driving-scene';

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
	const [width, height] = useWindowSize(undefined, undefined, { wait: 500 });
	return <DrivingScene width={width} height={height} className={styles.vh2} />;
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

type NavID = 'top' | 'door-scene' | 'bottom' | 'carpet' | 'ice-cream';

const navDivProps = (clickId: NavID) => {
	return {
		onClick: () => scrollToId(clickId),
		role: 'button'
	};
};

const topProps = navDivProps('ice-cream');
const iceCreamProps = navDivProps('carpet');
const carpetProps = navDivProps('door-scene');
const doorSceneProps = navDivProps('bottom');
const bottomProps = navDivProps('top');

function App() {
	return (
		<div className={styles.app}>
			<Parallax
				blur={{ min: -30, max: 50 }}
				bgImage={background}
				bgImageAlt="background"
				strength={300}
			>
				<div className={styles.appPage} id="top" {...topProps}>
					<Logo />
					WELCOME TO THE
					<div className={glitchStyles.glitch} data-text="OVERLOOK">
						OVERLOOK
					</div>
					HOTEL
				</div>
			</Parallax>
			<Parallax strength={200}>
				<div className={`${styles.appPage}`} id="driving" />
				<Background className={`${styles.vh1point5}`}>
					<DrivingSceneFullScreen />
				</Background>
			</Parallax>
			<Parallax strength={400}>
				<div className={styles.appPage} id="ice-cream" {...iceCreamProps}>
					You like ice cream, doc?
				</div>
			</Parallax>
			<Parallax strength={500}>
				<div className={`${styles.appPage} ${styles.vh1point5}`} id="carpet" {...carpetProps}>
					<GradySisters />
				</div>
				<Background className={styles.vh2}>
					<LogoBackground />
				</Background>
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
						<div
							className={`${styles.appPage} ${styles.vh4} ${styles.vignette}`}
							{...doorSceneProps}
						/>
					</>
				)}
			/>
			<Parallax strength={200}>
				<div className={styles.appPage} id="bottom" {...bottomProps}>
					Redux example
					<Counter />
				</div>
			</Parallax>
		</div>
	);
}

export default App;
