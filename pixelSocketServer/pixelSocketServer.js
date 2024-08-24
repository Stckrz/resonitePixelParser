const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 8080 });

wss.on('connection', (client) => {
	console.log('New Client Connected');

	client.on('message', (message) => {
		console.log('received: %s', message)

		const textMessage = message.toString();
		wss.clients.forEach((otherClient) => {
			if (otherClient !== client && otherClient.readyState === WebSocket.OPEN) {
				otherClient.send(textMessage);
			}
		})
	});

	client.on('close', () => {
		console.log('client disconnected..');
	});

	client.on('error', (error) => {
		console.log('uh oh an error: ', error);
	});
})

console.log('websocket server is listening on port 8080');
