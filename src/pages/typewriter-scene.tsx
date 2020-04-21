import React, { useState } from 'react';

import { InlineIcon } from '@iconify/react';
import keyboardIcon from '@iconify/icons-twemoji/keyboard';

const textToRepeat = 'all work and no play makes Jack a dull boy ';

const alterText = (text: string) => {
	const characters = text.length;
	const repeats = Math.floor(characters / textToRepeat.length);
	const extra = characters % textToRepeat.length;
	return new Array(repeats).fill(textToRepeat).join('') + textToRepeat.slice(0, extra);
};

const TypewriterScene = () => {
	const [text, setText] = useState('');

	return (
		<div>
			<div>
				<InlineIcon icon={keyboardIcon} />
				Leave a comment
				<InlineIcon icon={keyboardIcon} />
			</div>
			<div>
				<textarea
					style={{ minHeight: '30vh', minWidth: '50vw' }}
					value={alterText(text)}
					onChange={e => setText(e.target.value)}
				/>
			</div>
		</div>
	);
};

export default TypewriterScene;
