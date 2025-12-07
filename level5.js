const { GetInput } = require('./helpers');
const EnableConsole = false;
const Part = 2;

IngData = GetInput("input5.txt", data => {
    let output = {
        Ranges: [],
        Ingredients: []
    };
    let rows = data.replace(/\r/g, '').split('\n').map(row => row);

    rows.forEach(row => {
        row = row.trim();
        
        if(row == "") return;
        
        if(row.indexOf("-") > -1)
        {
            output.Ranges.push({Start : parseInt(row.split("-")[0].trim()), End: parseInt(row.split("-")[1].trim()) });
        } 
        else
        {
            output.Ingredients.push(parseInt(row));
    
        }
    });
    return output; 
});


let freshIngredients = 0;

if(Part == 1)
{
    IngData.Ingredients.forEach((item) => {
    
        for(let i = 0; i < IngData.Ranges.length; i++)
        {
            let range = IngData.Ranges[i];
            if(item >= range.Start && item <= range.End)
            {
                if(EnableConsole) console.log(`Ingredient ${item} is fresh (Range: ${range.Start}-${range.End})`);
                freshIngredients++;
                return;
            }
        }
    });
}
else
{
    IngData.Ranges.sort((a, b) => a.Start - b.Start);

    for(let i = 0; i < IngData.Ranges.length; i++)
    {
        consolidateRange(IngData.Ranges[i], IngData.Ranges, i + 1);
    }

    IngData.Ranges.map(range => range.End - range.Start + 1).forEach(rangeSize => {
        freshIngredients += rangeSize;
        if(EnableConsole) console.log(`Consolidated Range Size: ${rangeSize}`);
    });
}

function consolidateRange(currentRange, ranges, startIndex) {
    for(let j = startIndex; j < ranges.length; j++)
    {
        if(ranges[j].Start > currentRange.End)
            return;

        if(ranges[j].Start <= currentRange.End)
        {
            if(ranges[j].End > currentRange.End)
            {
                currentRange.End = ranges[j].End;
            }
            ranges.splice(j, 1);
            j--;
        }

    }
}

console.log(`Total Fresh Ingredients: ${freshIngredients}`);

