const express = require('express');
const router = new express.Router();
const stats = require('../controllers/statistics.js');

//router.route(`/test`).get();
router.route(`/arbetsmarknadsdata`).get(stats.arbetsmarknadsData);

//getNumFromSokande

module.exports = router;