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
module.exports = {resoniteFormat, resonitePrep, parseRgbArray}
