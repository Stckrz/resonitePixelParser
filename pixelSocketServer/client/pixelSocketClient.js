const WebSocket = require('ws');
const sharp = require('sharp');

const ws = new WebSocket('ws://localhost:8080/');

ws.on('open', () => {
	console.log("Websocket connection open");


	//takes an array and a number, and returns a 2d array where each array.length is the number.
	const parseRgbArray = (dataArray, sliceNumber) => {
		const newArray = []
		for (let i = 0; i < dataArray.length; i += sliceNumber) {
			const lilArray = Array.from(dataArray.slice(i, i + sliceNumber));
			newArray.push(lilArray);
		}
		return newArray;
	}

	//function that takes an array of arrays, each array is a pixel's rgb value, calculates the average RGB value of the array
	//finds the avg. rgb color of a 2d array of rgb colors
	const pixelAverageArrayHandler = (pixelDataArray) => {
		let r = 0;
		let g = 0;
		let b = 0;
		for (let i = 0; i < pixelDataArray.length; i++) {
			r += pixelDataArray[i][0]
			g += pixelDataArray[i][1]
			b += pixelDataArray[i][2]
		}
		const redAvg = ((r / pixelDataArray.length) / 255).toFixed(1)
		const blueAvg = ((r / pixelDataArray.length) / 255).toFixed(1)
		const greenAvg = ((r / pixelDataArray.length) / 255).toFixed(1)
		return [redAvg, blueAvg, greenAvg]
	}

	const resoniteFormat = (someArray) => {
		// console.log(someArray)
		// console.log(`p${1}[${someArray[0]}]`)
		const newArray = [];
		for (let i = 0; i < someArray.length; i++) {
			// newArray.push(`p${1}[${someArray[0]}]`)
			newArray.push(`p${i}[${someArray[i]},1.0]`)
		}
		return newArray

	}


	const getImageData = async (imagePath) => {
		try {
			const image = sharp(imagePath);
			const metadata = await image.metadata();
			// console.log('image metadata: ', metadata)
			//
			// determines whether the image data is in RGB or RGBA format
			const channels = metadata.channels;
			console.log(channels === 3 ? "rgb" : "rgba");

			//creates 2 arrays, one is an array of pixel color values, the other is an array of info about the image.
			//it is raw(), because we do not want any encoding, and it toBuffer({resolveWithObject: true}) converts image data into raw buffer for us.
			const { data, info } = await image.raw().toBuffer({ resolveWithObject: true });

			//divides the number of items in the data array by the number of channels, telling us how many pixels we have
			const pixels = data.length / channels;
			console.log('pixels', pixels);

			//We want a 16X16 grid, so we need to divide the number of pixels by 256, so we can see how many pixels in the old image, will be in the new image
			const pixelSize = pixels / 256;
			console.log('newPixelSize', pixelSize);

			//returns a 2d array where each array is the rgb data for each pixel
			const parsedRgbArray = parseRgbArray(data, channels)

			//returns a 3d array where each array is all of the values for a new 'pixel size'
			const newPixelMap = parseRgbArray(parsedRgbArray, pixelSize)

			const shitArray = []
			for (let i = 0; i < newPixelMap.length; i++) {
				shitArray.push(pixelAverageArrayHandler(newPixelMap[i]))
			}
			// console.log(shitArray)
			const finalArray = resoniteFormat(shitArray)
			for(let i = 0; i < finalArray.length; i++){
				ws.send(finalArray[i])
			}



			// console.log("parsedstuff", parseRgbArray(data, channels))

		} catch (error) {
			console.log("error", error)
		}
	}

	const finalArray = getImageData('./crapshoot.png')


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


