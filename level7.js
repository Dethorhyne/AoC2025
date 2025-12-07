const { GetInput } = require('./helpers');
const EnableConsole = false;
const Part = 2;

tachfold = GetInput("input7.txt", data => {
    let output = [];

    let rows = data.replace(/\r/g, '').split('\n');

    for(let i = 0; i < rows.length; i++)
    {
        output.push(rows[i].split(""));
    }
    return output; 
});

let numberOfSplits = 1;
let BeamDimensions = [];

let BeamIndexes = [];

for(let i = 0; i < tachfold[0].length; i++)
{
    BeamDimensions.push(0);
}

BeamIndexes.push(tachfold[0].indexOf("S"));

BeamDimensions[BeamIndexes[0]] = 1;

for(let i = 1; i < tachfold.length; i++)
{
    let nextPassBeams = [];
    let splitsInPass = 0;
    for(let j = 0; j < BeamIndexes.length; j++)
    {
        let currentBeam = BeamIndexes[j];
        if(tachfold[i][currentBeam] != "^")
        {
            tachfold[i][currentBeam] = "|";
            continue;
        }
        splitsInPass++;
        BeamIndexes.splice(j, 1); j--;
        if(i > 0)
        {
            BeamDimensions[currentBeam - 1] += BeamDimensions[currentBeam];
        
            if(nextPassBeams.indexOf(currentBeam - 1) == -1)
            {
                tachfold[i][currentBeam - 1] = "|";
                nextPassBeams.push(currentBeam - 1);
            }
        }
        if(i < tachfold.length - 1)
        {
            BeamDimensions[currentBeam + 1] += BeamDimensions[currentBeam];
            if(nextPassBeams.indexOf(currentBeam + 1) == -1)
            {
                tachfold[i][currentBeam + 1] = "|";
                nextPassBeams.push(currentBeam + 1);
            }
        }
        
        BeamDimensions[currentBeam] = 0;

        if(EnableConsole) console.log(`Beam split at row ${i} position ${currentBeam}`);
    }
    if(EnableConsole && i == tachfold.length - 1)
        RenderManifold(tachfold);
    numberOfSplits+=splitsInPass;

    BeamIndexes = BeamIndexes.concat(nextPassBeams);
    BeamIndexes = SortAndRemoveDuplicates(BeamIndexes);

}

console.log(`P1 Splits: ${numberOfSplits}, P2 Dimensions: ${BeamDimensions.reduce((a,b) => a + b, 0)}`);

function SortAndRemoveDuplicates(array)
{
    array = array.sort((a,b) => a - b)

    for(let i = 0; i < array.length - 1; i++)
    {
        if(array[i] == array[i+1])
        {
            array.splice(i, 1);
            i--;
        }
    }

    return array;
}

function RenderManifold(manifold)
{
    for(let i = 0; i < manifold.length; i++)
    {
        console.log(manifold[i].join(""));
    }
}
