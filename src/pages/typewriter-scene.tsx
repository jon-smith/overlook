import React, { useState } from 'react';

import { InlineIcon } from '@iconify/react';
import keyboardIcon from '@iconify/icons-twemoji/keyboard';

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
				<textarea value={text} onChange={e => setText(e.target.value)} />
			</div>
		</div>
	);
};

export default TypewriterScene;
