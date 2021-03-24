const stats = require('../controllers/statistics.js');

module.exports.setup =  (app) =>{
    /**
     * @swagger
     *
     * /login:
     *   post:
     *     produces:
     *       - application/json
     *     parameters:
     *       - name: username
     *         in: formData
     *         required: true
     *         type: string
     *       - name: password
     *         in: formData
     *         required: true
     *         type: string
     * 
     */
    app.get('/statistics/arbetsmarknadsdata', stats.arbetsmarknadsData);
    /**
     * @swagger
     * definitions:
     *   Login:
     *     required:
     *       - username
     *       - password
     *     properties:
     *       username:
     *         type: string
     *       password:
     *         type: string
     *       path:
     *         type: string
     */

    app.get('/statistics/months', stats.allMonthInDataset);
};