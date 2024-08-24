const WebSocket = require('ws');
const { getImageData } = require('./arrayFunctions')
const fs = require('fs')

const ws = new WebSocket('ws://localhost:8080/');
let pixelArray = []
let pixelArrayIndex = 0
let fileArray = []
let fileIndex = 0
let imageFile = './images/rusty.jpg'

ws.on('open', async () => {
	// pixelArray = await getImageData('./images/rusty.jpg')
	pixelArray = await getImageData(imageFile)
	pixelArrayIndex = 0
	fileArray = fs.readdirSync('./images')
	fileIndex = 0
	console.log("Websocket connection open");
});

ws.on('message', (message) => {
	console.log(message.toString());
	if (message.toString() === 'next') {
		if (pixelArrayIndex < pixelArray.length) {
			ws.send(pixelArray[pixelArrayIndex]);
			pixelArrayIndex += 1;
		}
	}

	if (message.toString() === 'ls') {
		if (fileIndex < fileArray.length) {
			ws.send('f' + fileArray[fileIndex]);
			fileIndex += 1;
		}
	}
	if(fileArray.includes(message.toString())){
		console.log('image swapped',message.toString());
		imageFile = `./images/${message.toString()}`;
		pixelArrayIndex = 0;
	}
});

ws.on('close', (event) => {
	console.log('Websocket connection closed', event);
});

ws.on('error', (error) => {
	console.error('Websocket Error: ', error);
});
