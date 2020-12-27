const {MongoClient} = require('mongodb');
const uri = "mongodb://statuser:kalle123@localhost:27017/statistik"; //TODO: Move this to .env

const TableEnum = Object.freeze({sokande: 1, arbetskraft: 2, platser: 3});

const antalPerAFkodPipeline = [
    {$match: {MANAD: ''}}, //Must be a variable
    {
        $group:
            {
                _id: {AFKOD: "$AFKOD", LANSKOD: "$LANSKOD"},
                totalt: {$sum: "$ANTAL"}
            }
    }
];

const fixRequestPipeline = (manad, lanskod, kommunkod) => {
    let thePipeline = JSON.parse(JSON.stringify(antalPerAFkodPipeline));
    thePipeline[0].$match.MANAD = manad;
    if (lanskod != null) thePipeline[0].$match.LANSKOD = lanskod;
    if (kommunkod != null) thePipeline[0].$match.KOMMUNKOD = kommunkod;
    return thePipeline;
};

//TODO: add more parameters kon, fodelseland, more...
const findSokandeTotalt = async (manad, lanskod = null, kommunkod = null) => {
    const client = new MongoClient(uri);
    try {
        await client.connect();
        const aggCursor = client.db("statistik")
            .collection("sokande")
            .aggregate(fixRequestPipeline(manad, lanskod, kommunkod))
            .sort({AFKOD: 1, _id: 1});
        return await aggCursor.toArray();
    } catch (e) {
        console.log(e)
    } finally {
        await client.close();
    }
};

const findPlatserTotalt = async (manad, lanskod = null, kommunkod = null) => {
    const client = new MongoClient(uri);
    try {
        await client.connect();
        const aggCursor = client.db("statistik")
            .collection("platser")
            .aggregate(fixRequestPipeline(manad, lanskod, kommunkod))
            .sort({AFKOD: 1, _id: 1});
        return await aggCursor.toArray();
    } catch (e) {
        console.log(e)
    } finally {
        await client.close();
    }
};
module.exports.findSokandeTotalt = findSokandeTotalt;
module.exports.findPlatserTotalt = findPlatserTotalt;
/*(async function() {
    // console.log(await findSokandeTotalt('2020-11', '01'));
     console.log(await findPlatserTotalt('2020-11', '01'));
})();
 */

