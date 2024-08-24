const sharp = require('sharp');
//takes an array and a number, and returns a 2d array where each array.length is the number.
const parseRgbArray = (dataArray, sliceNumber) => {
	const newArray = []
	for (let i = 0; i < dataArray.length; i += sliceNumber) {
		const lilArray = Array.from(dataArray.slice(i, i + sliceNumber));
		newArray.push(lilArray);
	}
	return newArray;
}

//takes an array of rgb values, and for each value, divides by 255.toFixed...
function resonitePrep(pixelRgbArray){
	const newArray = []
	for (let i = 0; i < pixelRgbArray.length; i++) {
		let pixelArray = []
		let r = (pixelRgbArray[i][0] / 255).toFixed(1)
		let g = (pixelRgbArray[i][1] / 255).toFixed(1)
		let b = (pixelRgbArray[i][2] / 255).toFixed(1)
		pixelArray.push(r)
		pixelArray.push(g)
		pixelArray.push(b)
		newArray.push(pixelArray)
	}
	return newArray
}

//takes the array of rgb arrays, and formats it to fit the resonite scheme(`p0[0.5;0.8;1.0;1.0]`)
function resoniteFormat(someArray){
	const newArray = [];
	for (let i = 0; i < someArray.length; i++) {
		const colorString = `p${i}[${someArray[i]};1.0]`
		const sendColorString = colorString.replace(/,/g, ';')
		newArray.push(sendColorString)
	}
	return newArray
}

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

	} catch (error) {
		console.log("error", error)
		
	}
}

module.exports = {resoniteFormat, resonitePrep, parseRgbArray, getImageData}
