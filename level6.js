const { GetInput } = require('./helpers');
const EnableConsole = false;
const Part = 2;

let collection = GetInput("input6.txt", data => {
    let output = {
        Rows : [],
        Operators: []
    };

    let StartIndexes = [];

    let rows = data.replace(/\r/g, '').split('\n');

    for(let i = 0; i < rows[rows.length - 1].length; i++)
    {
        let char = rows[rows.length - 1].charAt(i);
        if(char == "+" || char == "*")
        {
            output.Operators.push(char);
            StartIndexes.push(i);
        }
    }
    StartIndexes.push(rows[0].length+1);

    rows.forEach((row, i) => {
        if(i == rows.length - 1) return;
        let pieces = [];
        for( let j = 0; j < StartIndexes.length - 1; j++) 
        {
            let slice = row.slice(StartIndexes[j], StartIndexes[j+1]-1);
            pieces.push(slice.split(""))
        }
        
        output.Rows.push(pieces);
    });
    return output; 
});


let grandTotal = 0;

for(let i = 0; i < collection.Operators.length; i++)
{
    let localTotal = 0;
    let rowArray = [];
    if(Part == 1)
    {
        collection.Rows.forEach(row => {
            rowArray.push(parseInt(row[i].join("")));
        });
    }
    else
    {

        let transposedNumbers = {};
        for(let r = 0; r < collection.Rows.length; r++)
        {
            let row = collection.Rows[r];
            for(let c = row[i].length - 1; c >= 0; c--)
            {
                if(transposedNumbers[c] === undefined)
                    transposedNumbers[c] = "";
                transposedNumbers[c] += `${row[i][c]}`;
            }
        }   
        
        Object.keys(transposedNumbers).forEach(key => {
            if(transposedNumbers[key].trim() != "")
            {
                rowArray.push(parseInt(transposedNumbers[key]));
            }   
        });
    }

    switch(collection.Operators[i])
    {
        case "+":
            localTotal = rowArray.reduce((a, b) => a + b, 0);
            break;
        case "*":
            localTotal = rowArray.reduce((a, b) => a * b, 1);
            break;
    }
    
    
    grandTotal += localTotal;

    if(EnableConsole) console.log(`[${i + 1}]: ${rowArray.join(` ${collection.Operators[i]} `)} ${localTotal}`);
    
}


console.log(`Grand Total: ${grandTotal}`);