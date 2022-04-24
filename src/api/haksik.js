const express = require('express');
const router = express.Router();
const fs = require('fs').promises;
const ResultData = require('../models/resultData');
const {
  generateGeneralMealText,
  genreateTimeMealText,
} = require('../services/haksikChatMessageGenerator');

router.post('/tomorrow', async (req, res) => {
  data = JSON.parse(await readData(false));
  res.json(generateChatMessage(data));
});

router.post('/', async (req, res) => {
  data = JSON.parse(await readData(true));
  res.json(generateChatMessage(data));
});

function readData(isToday) {
  const filePath = isToday ? '../data/today/meal-hak.json' : '../data/tomorrow/meal-hak.json'
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


function generateChatMessage(data) {
  if (data === '""') {
    const resultData = { ...ResultData };
    resultData.template.outputs[0].simpleText.text =
      '아직 식단이 업데이트 되지 않았어요!';

    return res.json(resultData);
  }
  parsedData = JSON.parse(data);

  const koreanTableText = genreateTimeMealText(
    parsedData.koreanTable,
    '🍚 코테(든든한동) 🍚\n'
  );
  const fryfryText = generateGeneralMealText(
    parsedData.fryFry,
    '🥘 프라이프라이(H-Plate) 🥘\n'
  );
  const noodleRoadText = generateGeneralMealText(
    parsedData.noodleRoad,
    '🍝 누들로드 🍝\n'
  );

  const haoText = generateGeneralMealText(parsedData.hao, '🐼 하오 🐼\n');

  const graceGardenText = generateGeneralMealText(
    parsedData.graceGarden,
    '🍗 그레이스 가든 🍗\n'
  );
  const mixRiceText = generateGeneralMealText(
    parsedData.mixRice,
    '🍛 믹스 라이스(따스한동) 🍛\n'
  );

  const haksikText =
    koreanTableText +
    '\n' +
    fryfryText +
    '\n' +
    noodleRoadText +
    '\n' +
    haoText +
    '\n' +
    graceGardenText +
    '\n' +
    mixRiceText;

  const resultData = { ...ResultData };
  resultData.template.outputs[0].simpleText.text = haksikText;
  return resultData
}
module.exports = router;
