const express = require('express');
const router = express.Router();
const ResultData = require('../models/resultData');
const { covidStatus } = require('../services/covidTracker');

router.post('/', (req, res) => {
  covidStatus((result) => {
    const resultData = { ...ResultData };
    resultData.template.outputs[0].simpleText.text = result;
    res.json(resultData);
  });
});

module.exports = router;
