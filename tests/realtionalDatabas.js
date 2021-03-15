const oracledb = require('oracledb');

startup = async () => {
    try {
        console.log('Initializing database module');
        //TODO: remove hard coded to be fetched environment.
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

//TODO: Select MONTH distinct from DB and use it to fetch data in chunks.