
const express = require('express');
const morgan = require('morgan');
const webServerConfig = require('../config/web-server.js');
const routes = require('./routes.js');
const cors = require('cors');
const path = require('path');
const { graphqlHTTP } = require('express-graphql');
const  { makeExecutableSchema } = require('graphql-tools');
const {typeDefs} = require('../controllers/graphql/schema.js');
const {root, defaultQuery} = require('../controllers/graphql/resolver.js');
const app = express();
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const swaggerDefinition = require('../swaggerDefinition');
let server;


//TODO: Move to module? Swagger Options
const options = {
    swaggerDefinition,
    apis: ["../controllers/statistics.js"],
};


function initialize() {
    const specs = swaggerJsdoc(options);
    return new Promise((resolve, reject) => {
        app.use(cors());
        // Combines logging info from request and response
        app.use(morgan('combined'));
        app.use('/', express.static(path.join(__dirname,'../public'), {index:'index.xhtml'}));
        // Swagger
        app.use(
            "/statistics/api-docs",
            swaggerUi.serve,
            swaggerUi.setup(specs)
        );
        routes.setup(app);
        //Not needed ?
        app.get('/api-docs.json', (req, res) => {
            res.setHeader('Content-Type', 'application/json');
            res.send(specs);
        });

        // GraphQL
        const schema = makeExecutableSchema({typeDefs:typeDefs, resolvers: root});
        //TODO: run Graph(i)QL in 'Production' mode
        //you can use most express middleware just by inserting it before graphqlHTTP is mounted
        app.use('/statistics/graphql', graphqlHTTP({
            schema: schema,
            graphiql: {defaultQuery}
        }));
        server = app.listen(webServerConfig.port)
            .on('listening', () => {
                console.log(`Web server listening on localhost:${webServerConfig.port}`);
                resolve();
            })
            .on('error', err => {
                reject(err);
            });
    });
}

function close() {
    return new Promise((resolve, reject) => {
        server.close((err) => {
            if (err) {
                reject(err);
                return;
            }
            resolve();
        });
    });
}

module.exports.initialize = initialize;
module.exports.close = close;