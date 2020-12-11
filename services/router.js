const express = require('express');
const router = new express.Router();
const stats = require('../controllers/statistics.js');

router.route(`/test`).get(stats.getNumFromPlats);
router.route(`/arbetsmarknadsdata`).get(stats.getNumFromSokande);

//getNumFromSokande

module.exports = router;