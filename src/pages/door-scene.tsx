import React from 'react';
import axe from '@iconify/icons-twemoji/axe';
import door from '@iconify/icons-twemoji/door';
import angry from '@iconify/icons-twemoji/pouting-face';
import FixedIconContainer from 'components/fixed-pos-icon-container';

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
	const maxDoorSize = 9;
	if (p.stage === 'door') {
		return { bottomOffset: p.relativeP * 55 - 10, doorSize: p.relativeP * maxDoorSize };
	}
	if (p.stage === 'exit') {
		return { bottomOffset: p.relativeP * 55 + 45, doorSize: maxDoorSize };
	}
	return { bottomOffset: 45, doorSize: maxDoorSize };
};

const calcAxeOffset = (p: StageAndRelativeProgress) => {
	if (p.stage === 'axe' || p.stage === 'face') {
		const maxOffset = p.stage === 'face' ? 5 : 3.5;

		if (p.relativeP <= 1 / 3) return p.relativeP * 3 * maxOffset;
		if (p.relativeP <= 2 / 3) return maxOffset;

		return (1 - p.relativeP) * 3 * maxOffset;
	}

	return 0;
};

const calcFaceOffset = (p: StageAndRelativeProgress) => {
	if (p.stage === 'face') {
		const maxOffset = 3.5;
		if (p.relativeP <= 1 / 3) return p.relativeP * 3 * maxOffset;
		if (p.relativeP <= 2 / 3) return maxOffset;

		return (1 - p.relativeP) * 3 * maxOffset;
	}

	return 0;
};

const DoorSceneContents = (props: { percentage: number }) => {
	const { percentage } = props;

	const stageAndP = stageAndRelativeProgress(percentage);
	const stageIndex = stageToIndex(stageAndP.stage);

	const { bottomOffset, doorSize } = bottomOffsetAndDoorSize(stageAndP);
	const axeOffset = calcAxeOffset(stageAndP);
	const faceOffset = calcFaceOffset(stageAndP);
	return (
		<>
			{stageIndex >= stageToIndex('face') && (
				<FixedIconContainer
					icon={angry}
					widthEm={5}
					leftOffsetEm={faceOffset}
					bottomOffsetPc={bottomOffset}
					bottomOffsetEm={3}
				/>
			)}
			{stageIndex >= stageToIndex('axe') && (
				<FixedIconContainer
					icon={axe}
					widthEm={5}
					hFlip={true}
					leftOffsetEm={axeOffset}
					bottomOffsetPc={bottomOffset}
					bottomOffsetEm={1.5}
				/>
			)}
			<FixedIconContainer icon={door} widthEm={doorSize} bottomOffsetPc={bottomOffset} />
		</>
	);
};

const DoorScene = (props: { percentage: number }) => {
	const { percentage } = props;
	const hideAll = percentage <= 0.01 || percentage >= 0.99;
	return <div>{!hideAll && <DoorSceneContents {...props} />}</div>;
};

export default DoorScene;
