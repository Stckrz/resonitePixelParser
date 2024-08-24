const WebSocket = require('ws');

const ws = new WebSocket('ws://localhost:8080/');

ws.on('open', () => {
	console.log("Websocket connection open");
	ws.send('next')
});

ws.on('message', (message) => {
	console.log(message.toString());
});

ws.on('close', (event) => {
	console.log('Websocket connection closed', event);
});

ws.on('error', (error) => {
	console.error('Websocket Error: ', error);
});


