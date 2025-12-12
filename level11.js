const { GetInput } = require("./helpers");
const { performance } = require("perf_hooks");

let time = performance.now();

const memo = new Map();
const Devices = GetInput("input11.txt", (data) => {
	let output = {};
	let rows = data.replace(/\r/g, "").split("\n");

	rows.forEach((device, idx) => {
		const [deviceKey, connections] = device.trim().split(": ");
		output[deviceKey] = connections.split(" ");
	});

	return output;
});


function count(sourceKey, destinationKey) {
    let currentKey = sourceKey + "->" + destinationKey;
    if (memo.has(currentKey)) return memo.get(currentKey);

    if (sourceKey === destinationKey) return 1;

    let result = (Devices[sourceKey] || [])
        .map(x => count(x, destinationKey))
        .reduce((a, b) => a + b, 0);

    memo.set(currentKey, result);
    return result;
}

let TotalPaths = count("you", "out");

let TotalFFTDACPaths = count("svr", "dac") * count("dac", "fft") * count("fft", "out")
TotalFFTDACPaths += count("svr", "fft") * count("fft", "dac") * count("dac", "out");


console.log(`P1 Total paths: ${TotalPaths}`);
console.log(`P2 Total paths: ${TotalFFTDACPaths}`);
console.log(`Time taken: ${(performance.now() - time).toFixed(2)} ms`);
