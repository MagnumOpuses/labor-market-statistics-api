require('dotenv').config();

module.exports = {
    uri: process.env.MONGO_URI,
    api_url: process.env.SWAGGER_API_URL
};