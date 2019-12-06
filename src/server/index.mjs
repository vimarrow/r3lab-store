import WebSocket from 'ws';
import redux from 'redux';
import reducer from './reducer.mjs';

const wss = new WebSocket.Server({ port: process.env.PORT || 3030 });

const store = redux.createStore(reducer);

wss.on('connection', function connection(ws) {
	ws.on('message', function incoming(message) {
		const {type, payload} = JSON.parse(message);
		console.log('Processing:\n', message);
		store.dispatch({type, payload, ws});
	});
});
