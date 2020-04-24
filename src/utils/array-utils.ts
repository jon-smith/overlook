type ArrayLengthMutationKeys = 'splice' | 'push' | 'pop' | 'shift' | 'unshift';
export type FixedLengthArray<T, L extends number, TObj = [T, ...Array<T>]> = Pick<
	TObj,
	Exclude<keyof TObj, ArrayLengthMutationKeys>
> & {
	readonly length: L;
	[I: number]: T;
	[Symbol.iterator]: () => IterableIterator<T>;
};

export function makeArray<T>(count: number, factory: (i: number) => T) {
	const empty = new Array(count).fill(0);
	return empty.map((_, i) => factory(i));
}
