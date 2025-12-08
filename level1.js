const { GetInput } = require('./helpers');
const EnableConsole = false;

let inputs = GetInput("input1.txt", data => {
    return data.replace(/\r/g, '').split('\n');
});

const DialMin = 0, DialMax = 99;

let Dial = 50;
let OnZeroStops = 0;
let totalClicks = 0;

if(EnableConsole) 
    console.log("Dial Started At: " + Dial);

inputs.forEach(input => {
    let isLeft = input.charAt(0) == "L";
    let move = parseInt(input.slice(1));
    let clicks = 0;

    [Dial, clicks] = isLeft ? decrementDial(Dial, move) : incrementDial(Dial, move);
    totalClicks += clicks;
    OnZeroStops += Dial == 0 ? 1 : 0;

    if(EnableConsole)
    {
        if(clicks > 0 && Dial != 0) 
            console.log(`[${input}] Dial moved to ${Dial} after crossing zero ${clicks} time${clicks>1?"s":""}`);
        else
            console.log(`[${input}] Dial Moved To ${Dial}`);
    }
});

function incrementDial(Dial, move) {
    clicks = 0;
    if (Dial + move <= DialMax) return [Dial + move, 0];
    for(let i = 0; i < move; i++) {
        Dial++;
        if(Dial == 100) {
            Dial = DialMin;
            clicks++;
        }
    }
    return [Dial, clicks];
}

function decrementDial(Dial, move) {
    clicks = 0;
    if (Dial - move > DialMin) return [Dial - move, 0];
    if (Dial - move == DialMin) return [0, 1];
    for(let i = 0; i < move; i++) {
        Dial--;
        if(Dial == 0) clicks++;
        if(Dial < DialMin) Dial = DialMax;
    }
    return [Dial, clicks];
}

console.log(`P1 Password: {${OnZeroStops}} P2 Password: {${totalClicks}}`);