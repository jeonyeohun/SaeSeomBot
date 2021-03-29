const express = require('express');
const app = express();
const fs = require('fs').promises;

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

function genreateTimeMealText(corner, initialText) {
  console.log(corner);
  const price = '가격: ' + corner.price + '원\n\n';
  const morningMenu = '🥚 조식 🥚\n' + corner.morning.join('\n') + '\n\n';
  const lunchMenu = '🐣 중식 🐣\n' + corner.lunch.join('\n') + '\n\n';
  const dinnerMenu = '🐓 석식 🐓\n' + corner.dinner.join('\n') + '\n\n';

  return initialText + price + morningMenu + lunchMenu + dinnerMenu;
}

function generateGeneralMealText(corner, initialText) {
  let menuNum = corner.menus.length;

  for (let i = 0; i < menuNum; i++) {
    const menu = corner.menus[i];
    let price = null;
    if (corner.prices.length > i) price = corner.prices[i];
    if (price) initialText += menu + '\t' + price + '원\n';
    else initialText += menu + '\n';
  }

  if (menuNum == 0) return (initialText += '오늘은 운영하지 않아요 :)');
  return initialText;
}

app.get('/moms', async (req, res) => {
  let data = await fs.readFile(
    './raw_data/meal-moms.json',
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
  const result = {
    version: '2.0',
    template: {
      outputs: [
        {
          simpleText: {
            text: momsText,
          },
        },
      ],
    },
  };

  console.log(momsText);

  res.json(result);
});

app.get('/haksik', async (req, res) => {
  let data = await fs.readFile(
    './raw_data/meal-hak.json',
    'utf-8',
    (err, content) => {
      if (!content) {
        console.log(err);
        throw err;
      }
    }
  );
  data = JSON.parse(data);

  const koreanTableText = genreateTimeMealText(
    data.koreanTable,
    '🍚 코테(든든한동) 🍚\n'
  );
  const fryfryText = generateGeneralMealText(
    data.fryFry,
    '🥘 프라이프라이(H-Plate) 🥘\n'
  );
  const noodleRoadText = generateGeneralMealText(
    data.noodleRoad,
    '🍝 누들로드 🍝\n'
  );
  const haoText = generateGeneralMealText(data.hao, '🐼 하오 🐼\n');
  const graceGardenText = generateGeneralMealText(
    data.graceGarden,
    '🍗 그레이스 가든 🍗\n'
  );
  const mixRiceText = generateGeneralMealText(
    data.mixRice,
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

  console.log(haksikText);

  const result = {
    version: '2.0',
    template: {
      outputs: [
        {
          simpleText: {
            text: haksikText,
          },
        },
      ],
    },
  };
  res.json(result);
});

app.listen(3000, () => console.log('node on 3000'));
