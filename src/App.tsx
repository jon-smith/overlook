import React from 'react';
import { Parallax } from 'react-parallax';
import { Icon } from '@iconify/react';
import axe from '@iconify/icons-twemoji/axe';
import door from '@iconify/icons-twemoji/door';
import angry from '@iconify/icons-twemoji/pouting-face';
import Logo from './components/logo';
import background from './img/background1.jpg';
import { Counter } from './features/counter/Counter';
import styles from './app.module.css';
import glitchStyles from './glitch.module.scss';

const FixedIconContainer = <T extends {}>(props: {
	icon: T;
	width: string;
	hFlip?: boolean;
	bottomOffsetPc?: number;
	leftOffsetPx?: number;
}) => (
	<div
		style={{
			position: 'fixed',
			bottom: `${props.bottomOffsetPc ?? 0}%`,
			left: `${props.leftOffsetPx ?? 0}px`,
			width: '100vw'
		}}
	>
		<Icon icon={props.icon} width={props.width} hFlip={props.hFlip} />
	</div>
);

const bottomOffsetFromProp = (p: number) => {
	const zeroToFive = p * 5;
	if (zeroToFive < 2) {
		return (zeroToFive / 2) * 55 - 10;
	}
	if (zeroToFive < 4) {
		return 45;
	}
	return (zeroToFive - 4) * 45 + 55;
};

const DoorScene = (props: { percentage: number }) => {
	const { percentage } = props;
	const normalisedP = (percentage - 1 / 3) / (2 / 3);
	const hideAll = normalisedP <= 0.01 || normalisedP >= 0.99;
	if (hideAll) return <div />;

	const bottomOffset = bottomOffsetFromProp(normalisedP);
	const doorSize = Math.min(5, (5 * bottomOffset) / 45);
	const axeOffset = Math.min(50, Math.max(0.0, (normalisedP - 0.5) * 300));

	return (
		<div>
			{normalisedP >= 0.5 && (
				<FixedIconContainer
					icon={axe}
					width="3em"
					hFlip={true}
					leftOffsetPx={axeOffset}
					bottomOffsetPc={bottomOffset}
				/>
			)}
			{normalisedP >= 0.5 && (
				<FixedIconContainer icon={angry} width="3em" bottomOffsetPc={bottomOffset} />
			)}
			<FixedIconContainer icon={door} width={`${doorSize}em`} bottomOffsetPc={bottomOffset} />
		</div>
	);
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
						<div className={styles.appPage}>
							<DoorScene percentage={percentage} />
						</div>
						<div className={styles.appPage} />
						<div className={styles.appPage} />
					</>
				)}
			/>
			<div className={styles.appPage}>TEST</div>
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
