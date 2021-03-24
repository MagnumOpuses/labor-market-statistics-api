require('dotenv').config();

const config=
    {
        user: process.env.MONGO_USER,
        password: process.env.MONGO_PASSWORD,
        port: process.env.MONGO_PORT,
        host: process.env.MONGO_HOST,
        dbName: process.env.MONGO_DB_NAME,
        default_uri: "mongodb://"+process.env.MONGO_USER+":"+process.env.MONGO_PASSWORD+"@"+ process.env.MONGO_HOST + ":" + process.env.MONGO_PORT + "/" + process.env.MONGO_DB_NAME,
        api_url: process.env.SWAGGER_API_URL, //TODO: This shouldn't be here, extract host dynamic
    }

dumpConfig = () =>{
    const configText = "Mongo Configuration:\n";
    copy = Object.assign({}, config);
    copy.password = 'xxxxxxxxx';
    return configText+JSON.stringify(copy, null, 2);
};

module.exports = {
    config,
    dumpConfig
};
