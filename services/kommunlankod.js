const csv = require('csv-parser');
const fs = require('fs');
const results = [];

async function initialize() {
 const result = await fs.createReadStream('resources/kommunlankod.csv')
        .pipe(csv())
        .on('data', (data) => results.push(data))
        .on('end', () => {
           // console.log(results);
        });
    console.log(result);
    return result;
}

module.exports.initialize = initialize;