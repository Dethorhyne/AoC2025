const { GetInput } = require("./helpers");
const { performance } = require("perf_hooks");
const EnableConsole = false;
const Part = 1;

let time = performance.now();

const Summary = GetInput("input12.txt", (data) => {
	let output = {
        Presents: [],
        Grids: []
    };
	let sections = data.replace(/\r/g, "").split("\n\n");

    for(let i = 0; i < sections.length - 1; i++)
    {
        if(i == sections.length - 1) return;
        let section = sections[i];
        let present = {
            Size: 0,
            Area: [[],[],[]]
        };

        let rows = section.trim().split("\n");

        for(let r = 1; r < rows.length; r++)
        {
            let pieces = rows[r].trim().split("");
            for(let c = 0; c < pieces.length; c++)
            {
                present.Area[r-1].push(pieces[c] == "#" ? 1 : 0);
                if(pieces[c] == "#") present.Size++;
            }

        }
        output.Presents.push(present);
    }

    let grids = sections[sections.length - 1].trim().split("\n");

    for(let g = 0; g < grids.length; g++)
    {
        let grid = {
            Area: {
                X: null,
                Y: null
            },
            Presents: []
        }

        let [areaPart, presentPart] = grids[g].trim().split(": ");
        
        let areaPieces = areaPart.trim().split("x");
        grid.Area.X = parseInt(areaPieces[0]);
        grid.Area.Y = parseInt(areaPieces[1]);

        grid.Presents = presentPart.split(" ").map(x => parseInt(x));

        output.Grids.push(grid);
    }

	return output;
});
let GoodAreas = 0;

for(let g = 0; g < Summary.Grids.length; g++)
{
    let grid = Summary.Grids[g];

    let totalArea = grid.Area.X * grid.Area.Y;
    let PresentArea = 0;

    for(let p = 0; p < grid.Presents.length; p++)
    {
        let present = Summary.Presents[p];
        PresentArea += present.Size * grid.Presents[p];
    }
    if(PresentArea <= totalArea) GoodAreas++;
}


console.log(`P1 Valid Areas: ${GoodAreas}`); // very nice finish with a silly check working :)
console.log(`Time taken: ${(performance.now() - time).toFixed(2)} ms`);
