const { GetInput } = require('./helpers');
const {performance} = require('perf_hooks');
const EnableConsole = false;

let time = performance.now();

let dots = GetInput("input9.txt", data => {
    let output = {
        Matrix : {},
        Rows : new Set(),
        Cols : new Set(),
        Min : {
            x: null,
            y: null
        },
        Max : {
            x: null,
            y: null
        },
        Lines: {
            Col: {},
            Row: {}
        }
    };

    let rows = data.replace(/\r/g, '').split('\n');

    let previousLine = {
        Col: rows[rows.length-1].trim().split(",")[0],
        Row: rows[rows.length-1].trim().split(",")[1]
    }

    for(let i = 0; i < rows.length; i++)
    {
        let pieces = rows[i].trim().split(",");
        let col = parseInt(pieces[0]);
        let row = parseInt(pieces[1]);
        if(!output.Cols.has(col)) output.Cols.add(col);
        if(!output.Rows.has(row)) output.Rows.add(row);
        if(!output.Matrix[col]) output.Matrix[col] = [row];
        else output.Matrix[col].push(row);

        if(output.Min.x === null || col < output.Min.x) output.Min.x = col;
        if(output.Min.y === null || row < output.Min.y) output.Min.y = row;
        if(output.Max.x === null || col > output.Max.x) output.Max.x = col;
        if(output.Max.y === null || row > output.Max.y) output.Max.y = row;

        if(col == previousLine.Col)
        {
            if(output.Lines.Col[col] === undefined) output.Lines.Col[col] = [];
            output.Lines.Col[col].push({
                Start: Math.min(row, previousLine.Row),
                End: Math.max(row, previousLine.Row)
            });
        }
        if(row == previousLine.Row)
        {
            if(output.Lines.Row[row] === undefined) output.Lines.Row[row] = [];
            output.Lines.Row[row].push({
                Start: Math.min(col, previousLine.Col),
                End: Math.max(col, previousLine.Col)
            });
        }

        previousLine = {
            Col: col,
            Row: row
        };

    }

    output.Cols = Array.from(output.Cols).sort((a,b) => a - b);
    output.Rows = Array.from(output.Rows).sort((a,b) => a - b);

    return output; 
});

let MaxAreaP1 = 0;
let MaxAreaP2 = 0;

const caps = {
    Col: {
        Min: dots.Min.y * 1,
        Max: dots.Max.y * 1
    },
    Row: {
        Min: dots.Min.x * 1,
        Max: dots.Max.x * 1
    }
};

const midX = (dots.Min.x + dots.Max.x) / 2;
const midY = (dots.Min.y + dots.Max.y) / 2;

Object.keys(dots.Matrix).forEach(col => {
    let rowsInCol = dots.Matrix[col];
    for(let i = 0; i < rowsInCol.length; i++)
    {
        let row = parseInt(rowsInCol[i]);

        Object.keys(dots.Matrix).forEach(col2 => {
            let rowsInCol2 = dots.Matrix[col2];
            for(let i = 0; i < rowsInCol2.length; i++)
            {
                let row2 = parseInt(rowsInCol2[i]);

                if(col == col2 && row == row2) continue;
                if(col2 < caps.Col.Min || col2 > caps.Col.Max) continue;
                if(row2 < caps.Row.Min || row2 > caps.Row.Max) continue;

                if(ArePointsInSameQuadrant({ Col: parseInt(col), Row: row }, { Col: parseInt(col2), Row: row2 }, midX, midY))
                    continue;
                
                let area = GetDistance(parseInt(col), parseInt(col2)) * GetDistance(row, row2);

                if(area != null && area > MaxAreaP1)
                {
                    MaxAreaP1 = area;
                    if(EnableConsole) console.log(`New P1 Max Area: ${MaxAreaP1} from (${col},${row}) to (${col2},${row2})`);
                }
                
                if(area != null && area > MaxAreaP2)
                {
                    if(checkDotsAndLinesInArea(dots, {Col: col, Row: row},{Col: col2, Row: row2}, area, true))
                    {
                        continue;
                    }
                    
                    MaxAreaP2 = area;
                    if(EnableConsole) console.log(`New P2 Max Area: ${MaxAreaP2} from (${col},${row}) to (${col2},${row2})`);
                }
            }
        });
    }
});


function ArePointsInSameQuadrant(point1, point2, midX, midY)
{
    if(point1.Col < midX && point2.Col < midX)
    {
        if(point1.Row < midY && point2.Row < midY)
            return true; 
        if(point1.Row >= midY && point2.Row >= midY)
            return true;
    }
    if(point1.Col >= midX && point2.Col >= midX)
    {
        if(point1.Row < midY && point2.Row < midY)
            return true;
        if(point1.Row >= midY && point2.Row >= midY)
            return true;
    }
    return false;
}

function GetDistance(start, end)
{
    if(start > end) return start - end + 1;
    return end - start + 1;
}

function checkDotsAndLinesInArea(dots, coord1, coord2, area = null)
{
    let topLeft = 
    {
        Col: Math.min(coord1.Col, coord2.Col),
        Row: Math.min(coord1.Row, coord2.Row)
    };
    let bottomRight =
    {
        Col: Math.max(coord1.Col, coord2.Col),
        Row: Math.max(coord1.Row, coord2.Row)
    };

    for(let i = 0; i < dots.Cols.length; i++)
    {
        let col = dots.Cols[i];
        if(col <= topLeft.Col) continue;
        if(col >= bottomRight.Col) break;

        for(let j = 0; j < dots.Rows.length; j++)
        {
            let row = dots.Rows[j];
            if(row <= topLeft.Row) continue;
            if(row >= bottomRight.Row) break;
            if(dots.Matrix[col] && dots.Matrix[col].includes(row))
                return true;

            if(dots.Lines.Row[row] !== undefined)
            {
                for(let k = 0; k < dots.Lines.Row[row].length; k++)
                {
                    let line = dots.Lines.Row[row][k];
                    if(line.Start < bottomRight.Col && line.End > topLeft.Col)
                    {
                        return true;
                    }
                }
            }
        }
        if(dots.Lines.Col[col] !== undefined)
        {
            for(let k = 0; k < dots.Lines.Col[col].length; k++)
            {
                let line = dots.Lines.Col[col][k];
                if(line.Start < bottomRight.Row && line.End > topLeft.Row)
                {
                    return true;
                }
            }
        }
    }
    if(EnableConsole) console.log(`(${topLeft.Col},${topLeft.Row}) x (${bottomRight.Col},${bottomRight.Row}) = ${area == null ? 0 : area}`);
    
    return false;
}

console.log(`Max P1 Area: ${MaxAreaP1}`);
console.log(`Max P2 Area: ${MaxAreaP2}`);
console.log(`Time taken: ${(performance.now() - time).toFixed(2)} ms`);