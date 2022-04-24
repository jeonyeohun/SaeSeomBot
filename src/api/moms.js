const express = require('express');
const router = express.Router();
const fs = require('fs').promises;
const ResultData = require('../models/resultData');
const {
  genreateTimeMealText,
} = require('../services/haksikChatMessageGenerator');

router.post('/tomorrow', async (req, res) => {
  data = JSON.parse(await readData(false));
  res.json(genrateChatMessage(data));
});

router.post('/', async (req, res) => {
  data = JSON.parse(await readData(true));
  res.json(genrateChatMessage(data));
});

async function readData(isToday) {
  const filePath = isToday ? '../data/today/meal-moms.json' : '../data/tomorrow/meal-moms.json'
  return await fs.readFile(
    filePath,
    'utf-8',
    (err, content) => {
      if (!content) {
        console.log(err);
        throw err;
      }
    }
  );
}

function genrateChatMessage(data) {
  const momsText = genreateTimeMealText(data, '🍽 맘스 키친 🍽\n');
  const resultData = { ...ResultData };
  resultData.template.outputs[0].simpleText.text = momsText;
  return resultData
}

module.exports = router;
