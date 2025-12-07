const { GetInput } = require('./helpers');
const EnableConsole = false;
const Part = 2;

inputs = GetInput("input3.txt", data => {
    return data.replace(/\r/g, '').split('\n');
});


let totalJoltage = 0;
inputs.forEach(input => {

    let batteryPieces = [];

    for(let i = 1; i <= 12; i++) {
        if(i > 2 && Part == 1) break;
        batteryPieces.push(0);
    }

    let digits = input.split('').map(d => parseInt(d));

    for(let i = 0; i < digits.length; i++) {

        for(let j = 0; j < batteryPieces.length; j++) {
            let maxOffset = batteryPieces.length - (j + 1);
            if(batteryPieces[j] < digits[i] && i < digits.length - maxOffset) {
                batteryPieces[j] = digits[i];
                for(let k = j+1; k < batteryPieces.length; k++) {
                    batteryPieces[k] = 0;
                }
                break;
            }
        }
    }

    joltage = parseInt(batteryPieces.map(x => `${x}`).join(""));
    totalJoltage += joltage;
    if(EnableConsole) console.log(`[${input}] Max Joltage: ${joltage}`);

});

console.log("Total Joltage: " + totalJoltage);