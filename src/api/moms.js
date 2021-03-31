const express = require('express');
const router = express.Router();
const fs = require('fs').promises;
const ResultData = require('../models/resultData');
const {
  genreateTimeMealText,
} = require('../services/haksikResultTextGenerator');

router.post('/', async (req, res) => {
  let data = await fs.readFile(
    '../data/meal-moms.json',
    'utf-8',
    (err, content) => {
      if (!content) {
        console.log(err);
        throw err;
      }
    }
  );
  data = JSON.parse(data);

  const momsText = genreateTimeMealText(data, '🍽 맘스 키친 🍽\n');
  const resultData = { ...ResultData };
  resultData.template.outputs[0].simpleText.text = momsText;

  res.json(resultData);
});

module.exports = router;
