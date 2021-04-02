const express = require('express');
const router = express.Router();
const ResultData = require('../models/resultData');
const {
  arrivalInfoToHandong,
  arrivalInfoToYangdeok,
} = require('../services/busTracker');

router.post('/toHandong', (req, res) => {
  arrivalInfoToHandong((result) => {
    const resultData = { ...ResultData };
    resultData.template.outputs[0].simpleText.text = result;
    res.json(resultData);
  });
});

router.post('/toYangdeok', (req, res) => {
  arrivalInfoToYangdeok((result) => {
    const resultData = { ...ResultData };
    resultData.template.outputs[0].simpleText.text = result;
    res.json(resultData);
  });
});

module.exports = router;
