const oracledb = require('oracledb');
const dbConfig = require('../config/database.js');
//TODO: change to https://blogs.oracle.com/oraclemagazine/using-the-callback-pattern-and-the-async-module
async function initialize() {
    await oracledb.createPool(dbConfig.dbPool);
}

module.exports.initialize = initialize;


 async function close() {
    await oracledb.getPool().close();
}

module.exports.close = close;

function executeSQLStatement(statement, binds = [], opts = {}) {
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
}

hasDBConnection = async () => {
    await oracledb.ping( (error) => {
        console.log(error);
        return false;
    });
    return true;
};
module.exports.isDBWorking = hasDBConnection;
module.exports.executeSQLStatement = executeSQLStatement;
