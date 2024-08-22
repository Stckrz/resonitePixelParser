const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 8080 });

wss.on('connection', (ws) => {
	console.log('New Client Connected');
	ws.send('Hello, New Client!!');


	ws.on('message', (message) => {
		console.log('Got a message!', message.toString());
		ws.send(message.toString());
	});

	ws.on('close', () => {
		console.log('client disconnected..');
	});

	ws.on('error', (error) => {
		console.log('uh oh an error: ', error);
	});
})

console.log('websocket server is listening on port 8080');





