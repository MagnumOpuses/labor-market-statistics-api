require('dotenv').config();

module.exports = {
    port: process.env.HTTP_PORT,
    api_url: process.env.API_URL
};
