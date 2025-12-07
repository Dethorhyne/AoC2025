const { GetInput } = require('./helpers');
const EnableConsole = false;
const Part = 2;

inputs = GetInput("input2.txt", data => {
    return data.split(",").map(function(str){ return {Start: parseInt(str.trim().split("-")[0]), End: parseInt(str.trim().split("-")[1]) }; });
});


let totalIds = 0;
inputs.forEach(input => {
    for(let i = input.Start; i <= input.End; i++) {
        let strId = `${i}`;
        
        let start = Part == 1 ? 2 : 1;
        let end = Part == 1 ? 2 : strId.length / 2;
        for (let j = start; j <= end; j++) {
            if(strId.length % j != 0) continue;
            let pieces = [];
            for (let k = 0; k < strId.length; k += j) {
                pieces.push(strId.slice(k, k + j));
            }
            let allSame = pieces.every(function (val, _i, _arr) { return val === pieces[0]; });
            if (allSame) {
                totalIds+=i;
                if(EnableConsole) console.log(`Found Invalid ID: ${strId}`);
                break;
            }
        }
    }
});

console.log("Invalid ID Sum: " + totalIds);