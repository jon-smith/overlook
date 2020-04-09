import React from 'react';
import logo from './logo.svg';
import { Counter } from './features/counter/Counter';
import './App.css';
import './glitch.scss';

function App() {
	return (
		<div className="App">
			<header className="App-header">
				<img src={logo} className="App-logo" alt="logo" />
				WELCOME TO THE
				<div className="glitch" data-text="OVERLOOK">
					OVERLOOK
				</div>
				HOTEL
				<Counter />
			</header>
		</div>
	);
}

export default App;
