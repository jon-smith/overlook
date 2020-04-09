import React from 'react';
import Logo from './components/logo';
import { Counter } from './features/counter/Counter';
import './App.css';
import './glitch.scss';

function App() {
	return (
		<div className="App">
			<header className="App-header">
				<Logo />
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
