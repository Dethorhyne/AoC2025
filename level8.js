const { GetInput } = require('./helpers');
const EnableConsole = false;
const Part = 2;

class JunctionBox
{
    x = 0;
    y = 0;
    z = 0;
    stringFormat = "0-0-0";
    circuit = null;
    constructor(x, y, z)
    {
        this.x = x;
        this.y = y;
        this.z = z;
        this.stringFormat = `${x}-${y}-${z}`;
    }

    EuclideanDistanceTo(otherJunctionBox) {
        return Math.sqrt(
            (this.x - otherJunctionBox.x) ** 2 +
            (this.y - otherJunctionBox.y) ** 2 +
            (this.z - otherJunctionBox.z) ** 2
        );
    }
}

class Circuit
{
    Id = 0;
    JunctionBoxes = [];
    constructor(id)
    {
        this.Id = id;
    }

    AddJunctionBox(junctionBox)
    {
        this.JunctionBoxes.push(junctionBox);
        junctionBox.circuit = this;
    }

    MergeCircuit(otherCircuit)
    {
        otherCircuit.JunctionBoxes.forEach(junctionBox => {
            this.AddJunctionBox(junctionBox);
        });
    }
}

let jBoxes = GetInput("input8.txt", data => {
    let output = {};

    let rows = data.replace(/\r/g, '').split('\n');

    for(let i = 0; i < rows.length; i++)
    {
        let pieces = rows[i].trim().split(",");
        let jBox = new JunctionBox(parseInt(pieces[0]), parseInt(pieces[1]), parseInt(pieces[2]));
        output[jBox.stringFormat] = jBox;
    }
    return output; 
});
let jBoxValues = Object.values(jBoxes);

let distanceMatrix = [];
let usedKeys = new Set();

for(let i = 0; i < jBoxValues.length; i++)
{
    for(let j = 0; j < jBoxValues.length; j++)
    {
        if(i == j) continue;
        let key = jBoxValues[i].stringFormat+"|"+jBoxValues[j].stringFormat;
        let inverseKey = jBoxValues[j].stringFormat+"|"+jBoxValues[i].stringFormat;

        if(usedKeys.has(key) || usedKeys.has(inverseKey)) continue;
        usedKeys.add(key);
        
        distanceMatrix.push({Key: key, Distance: jBoxValues[i].EuclideanDistanceTo(jBoxValues[j])});
    }
}
delete(usedKeys);
delete(jBoxValues);

distanceMatrix = distanceMatrix.sort((a,b) => a.Distance - b.Distance);

let Circuits = {};
let circuitIdCounter = 1;

const Limit = Part == 1 ? 1000 : distanceMatrix.length;

let lastUsedXValues = [];

for(let i = 0; i < Limit; i++)
{
    let pieces = distanceMatrix[i].Key.split("|");
    let jBoxA = jBoxes[pieces[0]];
    let jBoxB = jBoxes[pieces[1]];

    if(jBoxA.circuit == jBoxB.circuit && jBoxA.circuit != null)
        continue;

    lastUsedXValues = [jBoxA.x, jBoxB.x];

    if(jBoxA.circuit == null && jBoxB.circuit == null)
    {
        let circuit = new Circuit(circuitIdCounter++);
        circuit.AddJunctionBox(jBoxA);
        circuit.AddJunctionBox(jBoxB);
        Circuits[circuit.Id] = circuit;
        if(EnableConsole) console.log(`Created Circuit ${circuit.Id} with Junction Boxes ${jBoxA.stringFormat} and ${jBoxB.stringFormat}`);
    }
    else if(jBoxA.circuit != null && jBoxB.circuit == null)
    {
        jBoxA.circuit.AddJunctionBox(jBoxB);
        if(EnableConsole) console.log(`Added Junction Box ${jBoxB.stringFormat} to Circuit ${jBoxA.circuit.Id}`);
    }
    else if(jBoxA.circuit == null && jBoxB.circuit != null)
    {
        jBoxB.circuit.AddJunctionBox(jBoxA);
        if(EnableConsole) console.log(`Added Junction Box ${jBoxA.stringFormat} to Circuit ${jBoxB.circuit.Id}`);
    }
    else if(jBoxA.circuit != jBoxB.circuit)
    {
        let circuitIdToDelete = jBoxB.circuit.Id;
        jBoxA.circuit.MergeCircuit(jBoxB.circuit);
        delete Circuits[circuitIdToDelete];
        if(EnableConsole) console.log(`Merged Circuit ${circuitIdToDelete} into Circuit ${jBoxA.circuit.Id}`);
    }
}

let circuitSizes = Object.values(Circuits).map(circuit => circuit.JunctionBoxes.length);
if(Part == 1)
{
    let ConnectionScore = SortAndReturnTopThree(circuitSizes).reduce((a,b) => a * b, 1);
    console.log(`Connection Score: ${ConnectionScore}`);
}
console.log(`Last Merge X values: [${lastUsedXValues.join(" * ")} = ${lastUsedXValues[0]*lastUsedXValues[1]}]`);

function SortAndReturnTopThree(array)
{
    array = array.sort((a,b) => b - a)
    return array.slice(0,3);
}
