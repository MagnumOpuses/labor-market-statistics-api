const mongoDB = require('../../services/mongoDB');

const root =  {
    Root: {
        sokande: async (obj, args, context, info) => {
            return await mongoDB.sokande(args);
        },
        plats: async (obj, args, context, info) => {
            return await mongoDB.plats(args);
        },
        arbetskraft: async (obj, args, context, info) => {
            return await mongoDB.arbetskraft(args);
        },
        arbetsmarknad: async (obj, args, context, info) => {
            return await mongoDB.getArbetsmarknadsdata(args);
        },
    },
    };

//TODO: add GraphQL subscritions https://github.com/graphql/express-graphql , https://www.apollographql.com/docs/react/data/subscriptions/
const defaultQuery = /* GraphQL */ `
#Används för att testa gränsnittet
#Ex.
#{sokande(Parameters:{MANAD:"2020-10", KOMMUNKOD:"0680"}){
#  MANAD
#  KOEN
#  LANSKOD
#  KOMMUNKOD
# UNG_VUXEN
#  TILLHOR_ETABLERING
#  FODELSELANDSGRUPP
#  AFKOD
#  ANTAL
#  }
#}
#
#Ex. Using Curl
#   curl -X POST -H "Content-Type: application/json" /
#   --data '{"query":"{sokande(Parameters:{MANAD:\\"2020-10\\"}) {MANAD AFKOD ANTAL}}"}' /
#   http://localhost:3000/statistics/graphql
`;

//TODO: It must be possible to fetch the latest data (an endpoint)
module.exports = {root, defaultQuery};