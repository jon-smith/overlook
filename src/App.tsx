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

type Stage = 'door' | 'axe' | 'face' | 'exit';

const stageToIndex = (s: Stage) => {
	switch (s) {
		case 'door':
			return 0;
		case 'axe':
			return 1;
		case 'face':
			return 2;
		case 'exit':
			return 3;
		default:
			return 4;
	}
};

type StageAndRelativeProgress = {
	stage: Stage;
	relativeP: number;
};

// Calculate the 'stage' of the animation and the relative progress within that stage
const stageAndRelativeProgress = (p: number): StageAndRelativeProgress => {
	const N = 7;
	const zeroToN = p * N;
	if (zeroToN < 2) {
		return { stage: 'door', relativeP: zeroToN / 2 };
	}
	if (zeroToN < 4) {
		return { stage: 'axe', relativeP: (zeroToN - 2) / 2 };
	}
	if (zeroToN < 6) {
		return { stage: 'face', relativeP: (zeroToN - 4) / 2 };
	}
	return { stage: 'exit', relativeP: zeroToN - (N - 1) };
};

const bottomOffsetAndDoorSize = (p: StageAndRelativeProgress) => {
	if (p.stage === 'door') {
		return { bottomOffset: p.relativeP * 55 - 10, doorSize: p.relativeP * 5 };
	}
	if (p.stage === 'exit') {
		return { bottomOffset: p.relativeP * 55 + 45, doorSize: 5 };
	}
	return { bottomOffset: 45, doorSize: 5 };
};

const calcAxeOffset = (p: StageAndRelativeProgress) => {
	if (p.stage === 'axe' || p.stage === 'face') {
		const maxOffset = p.stage === 'face' ? 90 : 50;

		if (p.relativeP <= 1 / 3) return p.relativeP * 3 * maxOffset;
		if (p.relativeP <= 2 / 3) return maxOffset;

		return (1 - p.relativeP) * 3 * maxOffset;
	}

	return 0;
};

const calcFaceOffset = (p: StageAndRelativeProgress) => {
	if (p.stage === 'face') {
		const maxOffset = 60;
		if (p.relativeP <= 1 / 3) return p.relativeP * 3 * maxOffset;
		if (p.relativeP <= 2 / 3) return maxOffset;

		return (1 - p.relativeP) * 3 * maxOffset;
	}

	return 0;
};

const DoorScene = (props: { percentage: number }) => {
	const { percentage } = props;
	// The start percentage depends on the height of the div in the current parallax section
	const startP = 0.375;
	const normalisedP = (percentage - startP) / (1 - startP);
	const hideAll = normalisedP <= 0.01 || normalisedP >= 0.99;
	if (hideAll) return <div />;

	const stageAndP = stageAndRelativeProgress(normalisedP);
	const stageIndex = stageToIndex(stageAndP.stage);

	const { bottomOffset, doorSize } = bottomOffsetAndDoorSize(stageAndP);
	const axeOffset = calcAxeOffset(stageAndP);
	const faceOffset = calcFaceOffset(stageAndP);
	return (
		<div>
			{stageIndex >= stageToIndex('face') && (
				<FixedIconContainer
					icon={angry}
					width="3em"
					leftOffsetPx={faceOffset}
					bottomOffsetPc={bottomOffset + 6}
				/>
			)}
			{stageIndex >= stageToIndex('axe') && (
				<FixedIconContainer
					icon={axe}
					width="3em"
					hFlip={true}
					leftOffsetPx={axeOffset}
					bottomOffsetPc={bottomOffset + 3}
				/>
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
