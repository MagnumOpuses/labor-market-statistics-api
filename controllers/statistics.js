/**
 * Indended to server direct http requests
 */

const mongoDB = require('../services/mongoDB');
const arbetsmarknadsData = async (req, res, next) => {
    try {
        //TODO:Validate in parameters (risk for noSql injection?)
        let response = await mongoDB.fetchArbetsmarknadsData(req.query.manad, req.query.lanskod, req.query.kommunkod,
            req.query.koen, req.query.ung_vuxen, req.query.tillhor_etablering, req.query.fodelselandsgrupp);
        res.status(200).json(response);
    } catch (error) {
        next(error);
    }
};

const allMonthInDataset = async (req, res, next) =>{
    try {
        let response = await mongoDB.getAllMonthSorted();
        res.status(200).json(response);
    } catch (error) {
        next(error);
    }
}

//const getRawData()
//TODO: refactor fetchDataFromDB put it in DB file...
module.exports = {arbetsmarknadsData, allMonthInDataset};