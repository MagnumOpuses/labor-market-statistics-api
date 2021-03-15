const oracledb = require('oracledb');
const fs = require('fs');

startup = async () => {
    try {
        console.log('Initializing database module');
        await oracledb.createPool({
            user: "publik_api",
            password: "aH72G15apI",
            connectString: "dwdb.ams.se/dw"});
    } catch (err) {
        console.error(err);
        process.exit(1); // Non-zero failure code
    }
};

close = async () => {
    await oracledb.getPool().close();
};

executeSQLStatement = (statement, binds = [], opts = {})  => {
    //executeMany(), http://oracle.github.io/node-oracledb/doc/api.html#executeoptions
    return new Promise(async (resolve, reject) => {
        let conn;
        opts.outFormat = oracledb.OBJECT;
        opts.autoCommit = true;
        try {
            conn = await oracledb.getConnection();
            const result = await conn.execute(statement, binds, opts);
            resolve(result);
        } catch (err) {
            reject(err);
        } finally {
            if (conn) { // conn assignment worked, need to close
                try {
                    await conn.close();
                } catch (err) {
                    console.log(err);
                }
            }
        }
    });
};
getData = async  (month) => {
    let bind = { manad:month};
    let sql = "select * from SOKANDE where manad=:manad";
    try{
        let dbResult = await executeSQLStatement(sql, bind);
        /*for (let index = 0; dbResult.rows.length > index; index++) {
            console.log(dbResult.rows[index]);
        }
         */
        //console.log(dbResult.rows);
        //const data = JSON.stringify(dbResult.rows, undefined, 4);
        const data = JSON.stringify(dbResult.rows);
        //const stream = fs.createWriteStream("../resources/sokande_");
        fs.writeFile('../resources/sokande.'+bind.manad+'.json', data, (err) => {
            if (err) {
                throw err;
            }
            console.log("JSON data is saved.");
        });
    } catch (err) {
        console.log(err);
    }
};

filterPlatsFile = async () =>{
    const result = await fs.createReadStream('../resources/sokande_2020-10.json')
        .on('data', (data) => console.log("Data: "+data))
        .on('end', () => {
            // console.log(results);
        });
    console.log(result);
    return result;
};

(async function() {
    await startup();
    await getData('2020-11');
    //await filterPlatsFile();

})();
