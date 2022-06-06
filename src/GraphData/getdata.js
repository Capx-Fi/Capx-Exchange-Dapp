const jsondata = require("./sm.json");

nobj = {
	open: {},
	close: {},
	max: {},
	min: {},
};
var keys = Object.keys(jsondata);
const map1 = keys.map((x) => parseInt(x));
// console.log(map1)
map1.sort();
// console.log(map1)
// console.log("open = ", jsondata[map1[0].toString()])
nobj["open"]["timestamp"] = map1[0];
nobj["open"]["value"] = jsondata[map1[0].toString()];
// console.log("close = ", jsondata[map1[map1.length-1].toString()])
nobj["close"]["timestamp"] = map1[map1.length - 1];
nobj["close"]["value"] = jsondata[map1[map1.length - 1].toString()];
let max = jsondata[map1[0].toString()];
let min = jsondata[map1[0].toString()];
map1.forEach((element) => {
	if (jsondata[element.toString()] > max) {
		max = jsondata[element.toString()];
		nobj["max"]["timestamp"] = element;
		nobj["max"]["value"] = jsondata[element.toString()];
	}

	if (jsondata[element.toString()] < min) {
		min = jsondata[element.toString()];
		nobj["min"]["timestamp"] = element;
		nobj["min"]["value"] = jsondata[element.toString()];
	}
});

// console.log("max = ", max)
// console.log("min = ", min)
// console.log(nobj)
