import { AppThunk } from './store';
import { incrementByAmount } from './counterSlice';

export const incrementAsync = (amount: number): AppThunk => dispatch => {
	setTimeout(() => {
		dispatch(incrementByAmount(amount));
	}, 1000);
};
