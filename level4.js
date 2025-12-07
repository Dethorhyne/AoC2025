const { GetInput } = require('./helpers');
const EnableConsole = false;
const Part = 2;

grid = GetInput("input4.txt", data => {
    let output = [];
    let rows = data.replace(/\r/g, '').split('\n');

    rows.forEach(row => {
        let parts = row.split("");
        output.push(parts.map(function(ch) { return ch == "@"; }));
    });
    return output; 
});


let totalRolls = 0;
let iteration = 0;

let rollPositions = [];
do {
    rollPositions = [];
    grid.forEach((row, rowIdx) => {
        row.forEach((cell, colIdx) => {
            if(!cell) return;
            let neighborRolls = checkSurroundingFields(grid, rowIdx, colIdx);
            if(neighborRolls < 4) {
                rollPositions.push(`${rowIdx}-${colIdx}`);
                //console.log(`[${rowIdx}-${colIdx}] Roll Found with only ${neighborRolls} neighboring fields`);
            }
        });
    });
    if(Part == 2) {
        if(EnableConsole) console.log(`Iteration ${++iteration}: Found ${rollPositions.length} movable rolls`);
    }
    totalRolls += rollPositions.length;

    if(Part == 1 || (Part == 2 && rollPositions.length == 0))
        grid.forEach((row, rowIdx) => {
            console.log(row.map((cell, colIdx) => rollPositions.indexOf(`${rowIdx}-${colIdx}`) > -1 ? "x" : cell ? "@" : ".").join(""));
        });

    grid.forEach((row, rowIdx) => {
        row.forEach((cell, colIdx) => {
            if(rollPositions.indexOf(`${rowIdx}-${colIdx}`) > -1) {
                grid[rowIdx][colIdx] = false;
            }
        });
    });

} while(Part == 2 && rollPositions.length > 0);

if(Part == 1)
{
    console.log(`Total movable rolls: ${rollPositions.length}`);
}
else
{
    console.log("Total Rolls Moved: " + totalRolls);
}

function checkSurroundingFields(grid, row, col, distance = 1) {
    let sum = 0;
    for(let r = row - distance; r <= row + distance; r++) {
        for(let c = col - distance; c <= col + distance; c++) {
            if(r < 0 || r >= grid.length || c < 0 || c >= grid[0].length) continue;
            if(r == row && c == col) continue;
            if(grid[r][c]) sum++;
        }
    }
    return sum;
}
