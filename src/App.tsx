import React from 'react';
import { Parallax } from 'react-parallax';
import Logo from 'components/logo';
import NoiseCanvas from 'components/noise-canvas';
import background from 'img/background1.jpg';
import { Counter } from 'features/counter/Counter';
import styles from 'app.module.scss';
import glitchStyles from 'glitch.module.scss';
import useWindowSize from 'hooks/use-window-size';
import DoorScene from 'pages/door-scene';

const FourPageNoiseCanvas = () => {
	const { width, height } = useWindowSize();
	return (
		<NoiseCanvas
			width={width}
			height={height * 4}
			className={styles.appPageHt4}
			style={{ position: 'absolute', left: 0, top: 0 }}
		/>
	);
};

const convertDoorScenePercentage = (percentage: number) => {
	// The start percentage depends on the height of the div in the current parallax section
	const startP = 0.375;
	return (percentage - startP) / (1 - startP);
};

function App() {
	return (
		<div className={styles.app}>
			<Parallax
				blur={{ min: -30, max: 50 }}
				bgImage={background}
				bgImageAlt="background"
				strength={300}
			>
				<div className={styles.appPage}>
					<Logo />
					WELCOME TO THE
					<div className={glitchStyles.glitch} data-text="OVERLOOK">
						OVERLOOK
					</div>
					HOTEL
				</div>
			</Parallax>
			<Parallax
				bgImage="dummy"
				strength={0}
				renderLayer={percentage => (
					<>
						<FourPageNoiseCanvas />
						<div className={styles.appPageHt4}>
							<DoorScene percentage={convertDoorScenePercentage(percentage)} />
						</div>
					</>
				)}
			/>
			<div className={styles.appPage} />
			<Parallax strength={200}>
				<div className={styles.appPage}>
					Redux example
					<Counter />
				</div>
			</Parallax>
		</div>
	);
}

export default App;
