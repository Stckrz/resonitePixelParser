const WebSocket = require('ws');
const sharp = require('sharp');
const { parseRgbArray, resonitePrep, resoniteFormat } = require('./arrayFunctions')

const getImageData = async (imagePath) => {
	try {
		const image = sharp(imagePath);
		const thumbImage = image.resize({
			width: 32,
			height: 32
		})
		const metadata = await thumbImage.metadata();

		// determines whether the image data is in RGB or RGBA format
		const channels = metadata.channels;
		console.log(channels === 3 ? "rgb" : "rgba");

		//creates 2 arrays, one is an array of pixel color values, the other is an array of info about the image.
		//it is raw(), because we do not want any encoding, and it toBuffer({resolveWithObject: true}) converts image data into raw buffer for us.
		const { data, info } = await thumbImage.raw().toBuffer({ resolveWithObject: true });

		//divides the number of items in the data array by the number of channels, telling us how many pixels we have
		const pixels = data.length / channels;
		// console.log('pixels', pixels);
		console.log("width", info.width)

		//We want a 16X16 grid, so we need to divide the number of pixels by 256, so we can see how many pixels in the old image, will be in the new image
		const pixelSize = parseInt(pixels / 1024);
		// console.log("pixels", pixels)
		// console.log("pixelsize", pixelSize)

		//returns a 2d array where each array is the rgb data for each pixel
		const parsedRgbArray = parseRgbArray(data, channels)

		const shitArray = []
		for (let i = 0; i < parsedRgbArray.length; i += pixelSize) {
			shitArray.push(parsedRgbArray[i])
		}
		const preppedArray = resonitePrep(shitArray)

		const finalArray = resoniteFormat(preppedArray)
		return finalArray;

		// function sendNextItem(index = 0) {
		// 	if (index >= finalArray.length) return;
		// 	ws.send(finalArray[index]);
		// 	setTimeout(() => {
		// 		sendNextItem(index + 1)
		// 	}, 50)
		// }
		// sendNextItem();


		// for(let i = 0; i < finalArray.length; i++){
		// 	ws.send(finalArray[i]);
		// }
	} catch (error) {
		console.log("error", error)
		
	}
}
const ws = new WebSocket('ws://localhost:8080/');
let ass = []
let assIndex = 0 

ws.on('open', async() => {
	ass = await getImageData('./pika.png')
	assIndex = 0
	console.log("Websocket connection open");


});

ws.on('message', (message) => {
	console.log(message.toString());
	if (message.toString() === "print") {
		getImageData('./pika.png')
	}
	if(message.toString() === 'next'){
		if(assIndex < ass.length){
			ws.send(ass[assIndex]);
			assIndex += 1;
		}
	}
});

ws.on('close', (event) => {
	console.log('Websocket connection closed', event);
});

ws.on('error', (error) => {
	console.error('Websocket Error: ', error);
});


