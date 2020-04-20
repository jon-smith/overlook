import { useState, useCallback } from 'react';

const useStateWithTime = <T extends unknown>(initial: T, checkEquality = true) => {
	const [value, setValue] = useState({ value: initial, time: Date.now() });
	const setValueAndTime = useCallback(
		(newValue: T) => {
			if (!checkEquality || value.value !== newValue) {
				setValue({ value: newValue, time: Date.now() });
			}
		},
		[checkEquality, value.value]
	);

	return [value.value, setValueAndTime, value.time] as const;
};

export default useStateWithTime;
