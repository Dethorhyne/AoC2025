const fs = require('fs');
const path = require('path');

function GetInput(file, callback) {

    const inputPath = path.join(__dirname, file);
    let data;
    try {
        data = fs.readFileSync(inputPath, 'utf8');
    } catch (e) {
        console.error('Cannot read input file:', e.message);
        process.exit(1);
    }

    return callback(data);
}

module.exports = { GetInput };