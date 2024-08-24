const WebSocket = require('ws');

const ws = new WebSocket('ws://localhost:8080/');

ws.on('open', () => {
	console.log("Websocket connection open");
	ws.send('rustyaa.jpg')
});

ws.on('message', (message) => {
	console.log(message.toString().substring(1));
	if(message.toString().split()[0].charAt() === 'f'){
		ws.send('ls')
	}if(message.toString().split()[0].charAt() === 'p'){
		ws.send('next')
	}
});

ws.on('close', (event) => {
	console.log('Websocket connection closed', event);
});

ws.on('error', (error) => {
	console.error('Websocket Error: ', error);
});


