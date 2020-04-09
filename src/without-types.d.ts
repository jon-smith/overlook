/* eslint-disable @typescript-eslint/no-explicit-any */

// Modules that dont have associated types are declared here
// This allows us to use noImplicitAny

declare module '*.jpg' {
	const value: any;
	export = value;
}

declare module '*.module.css' {
	const classes: { [key: string]: string };
	export default classes;
}
