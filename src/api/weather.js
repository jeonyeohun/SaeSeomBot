const express = require('express');
const router = express.Router();
const { weatherText } = require('../services/weatherTracker');
const ResultData = require('../models/resultData');
const openWeatherAPIKey = require('../keys/apiKeys');

router.post('/', (req, res) => {
  weatherText((result) => {
    const resultData = { ...ResultData };
    resultData.template.outputs[0].simpleText.text = result;
    res.json(resultData);
  });
});

module.exports = router;
