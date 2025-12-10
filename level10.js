const { GetInput } = require("./helpers");
const { performance } = require("perf_hooks");

const solver = require("javascript-lp-solver"); //requires installation of the npm package

const EnableConsole = false;

let time = performance.now();

let manuals = GetInput("input10.txt", (data) => {
	let output = {
		Lights: [],
		Buttons: [],
		Joltages: [],
	};

	let rows = data.replace(/\r/g, "").split("\n");

	for (let i = 0; i < rows.length; i++) {
		output.Lights.push([]);
		output.Buttons.push([]);
		output.Joltages.push([]);

		var split = rows[i].trim().split(" ");
		var lights = split[0].split("");
		output.Joltages[i] = split[split.length - 1]
			.substring(1, split[split.length - 1].length - 1)
			.split(",");

		for (let j = 1; j < lights.length - 1; j++) {
			output.Lights[i].push(lights[j] == "#" ? 1 : 0);
		}

		for (let j = 1; j < split.length - 1; j++) {
			var button = split[j];

			output.Buttons[i].push(
				button
					.substring(1, button.length - 1)
					.split(",")
					.map((x) => parseInt(x))
			);
		}
	}

	return output;
});

let ToggleSum = 0;
let JoltageToggleSum = 0;

for (let m = 0; m < manuals.Lights.length; m++) {
	let lights = manuals.Lights[m];
	let buttons = manuals.Buttons[m];
	let joltages = manuals.Joltages[m];

	let minSteps = CalculateMinButtonPresses(lights, buttons, joltages);
	let minJoltage = CalculateMinJoltage(joltages, buttons);
	if(EnableConsole) console.log(`Pattern matched with buttons: ${minSteps.map((x) => "[" + x.join(",") + "]").join(" ")}`);
    if(EnableConsole) console.log(`Minimum joltage achieved: ${minJoltage}`);

	ToggleSum += minSteps.length;
    JoltageToggleSum += minJoltage;
}

function CalculateMinJoltage(joltages, buttons) {
	const target = joltages.map((x) => x);

	const buttonMap = [];

	for (let i = 0; i < buttons.length; i++) {
		let button = buttons[i];
		buttonMap.push([]);
		for (let j = 0; j < joltages.length; j++) {
			buttonMap[i].push(button.includes(j) ? 1 : 0);
		}
	}

	const model = {
		optimize: "cost",
		opType: "min",
		constraints: {},
		variables: {},
		ints: {},
	};

	for (let i = 0; i < target.length; i++) {
		model.constraints[`pos_${i}`] = { equal: target[i] };
	}

	for (let j = 0; j < buttonMap.length; j++) {
		const varName = `instr_${j}`;
		model.variables[varName] = { cost: 1 };
		model.ints[varName] = 1;

		for (let i = 0; i < target.length; i++) {
			if (buttonMap[j][i] !== 0) {
				model.variables[varName][`pos_${i}`] = buttonMap[j][i];
			}
		}
	}

	const result = solver.Solve(model);
	return result.result;
}

function CalculateMinButtonPresses(lights, buttons, joltages) {
	let Iterator = 0;
	let Container = [];
	solutionFound = false;
	const initialState = {
		Lights: lights.map((x) => 0),
		PatternMatch: CheckPatternOverlap(
			lights.map((x) => 0),
			lights
		),
		ButtonsPressed: [],
	};
	Container.push([initialState]);

	while (!solutionFound) {
		Container.push([]);
		for (let i = 0; i < Container[Iterator].length; i++) {
			let currentState = Container[Iterator][i];
			for (let b = 0; b < buttons.length; b++) {
				let button = buttons[b];
				let newLights = pressButton(
					currentState.Lights.slice(),
					button
				);

				let newState = {
					Lights: newLights,
					PatternMatch: CheckPatternOverlap(newLights, lights),
					ButtonsPressed: currentState.ButtonsPressed.map((x) => x),
				};

				if (newState.PatternMatch < currentState.PatternMatch / 3)
					continue;

				newState.ButtonsPressed.push(button);
				if (newState.PatternMatch >= 100) {
					solutionFound = true;
					return newState.ButtonsPressed;
				}
				Container[Iterator + 1].push(newState);
			}
		}
		Container[Iterator + 1].sort((a, b) => b.PatternMatch - a.PatternMatch);
		Iterator++;
	}
}

function CheckPatternOverlap(currentLights, targetLights) {
	let matchCount = 0;
	for (let i = 0; i < currentLights.length; i++) {
		if (currentLights[i] == targetLights[i]) matchCount++;
	}
	return (matchCount / targetLights.length) * 100;
}

function pressButton(currentLights, button) {
	for (let i = 0; i < button.length; i++) {
		let index = button[i];
		currentLights[index] = 1 - currentLights[index];
	}
	return currentLights;
}

console.log(`P1 Sum of toggles: ${ToggleSum}`);
console.log(`P2 Sum of minimum joltage: ${JoltageToggleSum}`);
console.log(`Time taken: ${(performance.now() - time).toFixed(2)} ms`);
