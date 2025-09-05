import { h, render } from 'preact';
import App from './Components/App';

function initializeForeground() {
	const rootElement = document.createElement('div');
	document.body.appendChild(rootElement);
	render(<App />, rootElement);
}

initializeForeground();