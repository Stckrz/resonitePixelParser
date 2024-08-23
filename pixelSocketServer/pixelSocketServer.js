const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 8080 });

wss.on('connection', (client) => {
	console.log('New Client Connected');
	client.send('Hello, New Client!!');

	client.on('message', (message) => {
		console.log('received: %s', message)

		const textMessage = message.toString();

		if (textMessage === 'br55667') {
			wss.clients.forEach((ws) => {
				console.log('br55667 read')
				if (client.readyState === WebSocket.OPEN) {
					client.send(textMessage);
				}
			})
		} else {
			wss.clients.forEach((client) => {
				if (client.readyState === WebSocket.OPEN) {
					client.send(textMessage);
				}
			});
		}
	});

	// ws.on('message', (message) => {
	// 	console.log('Got a message!', message.toString());
	// 	ws.send(message.toString());
	// });

	client.on('close', () => {
		console.log('client disconnected..');
	});

	client.on('error', (error) => {
		console.log('uh oh an error: ', error);
	});
})

console.log('websocket server is listening on port 8080');





