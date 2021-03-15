const webServerConfig = require('./config/web-server');
module.exports = {
        openapi: "3.0.0",
        info: {
            title: "Arbetsmarknadsstatistik API ",
            version: "0.1.0",
            description:
                "",
            license: {
                name: "MIT",
                url: "https://spdx.org/licenses/MIT.html",
            },
            contact: {
                name: "JobTech Dev",
                url: "https://jobtechdev.se",
                email: "jobtechdev@arbetsformedlingen.se",
            },
        },
        servers: [
            {
                url: webServerConfig.api_url,
            },
        ]
};