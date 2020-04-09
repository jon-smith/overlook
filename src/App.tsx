import React from 'react';
import { Parallax } from 'react-parallax';
import Logo from './components/logo';
import background from './img/background1.jpg';
import { Counter } from './features/counter/Counter';
import './App.css';
import './glitch.scss';

function App() {
	return (
		<div className="App">
			<Parallax
				blur={{ min: -30, max: 50 }}
				bgImage={background}
				bgImageAlt="background"
				strength={300}
			>
				<div className="app-page">
					<Logo />
					WELCOME TO THE
					<div className="glitch" data-text="OVERLOOK">
						OVERLOOK
					</div>
					HOTEL
				</div>
			</Parallax>
			<Parallax blur={1} strength={200}>
				<div className="app-page">
					Redux example
					<Counter />
				</div>
			</Parallax>
		</div>
	);
}

export default App;
