const express = require('express');
const router = express.Router();
const { weatherForecast } = require('../services/weatherTracker');
const ResultData = require('../models/resultData');

router.post('/', (req, res) => {
  weatherForecast((result) => {
    const resultData = { ...ResultData };
    resultData.template.outputs[0].simpleText.text = result;
    res.json(resultData);
  });
});

module.exports = router;
