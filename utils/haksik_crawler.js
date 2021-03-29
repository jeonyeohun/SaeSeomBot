const request = require('request');
const fs = require('fs');
const schedule = require('node-schedule');

function parseData(data, isMenuData = true, isMomsData = false) {
  if (!data && isMenuData) return ['오늘은 운영하지 않아요 :)'];
  if (!data) return [];
  let result = [];
  const parsedData = data.split('\r\n');

  if (isMenuData && isMomsData) {
    result = parsedData.filter((menu) => menu != '');
    if (result.length == 0) {
      result = ['오늘은 운영하지 않아요 :)'];
    }
  } else if (isMenuData) {
    parsedData.shift();
    result = parsedData.filter((menu) => menu != '');
    if (result.length == 0) result = ['오늘은 운영하지 않아요 :)'];
  } else {
    result = parsedData.filter((price) => {
      price = price.replace(/,/g, '');
      return /^\d+$/.test(price);
    });
  }

  return result;
}

function parseHaksikData(responseBody) {
  const data = {
    koreanTable: parseKoreanTable(responseBody),
    fryFry: parseFryFry(responseBody),
    noodleRoad: parseNoodleRoad(responseBody),
    hao: parseHao(responseBody),
    graceGarden: parseGraceGarden(responseBody),
    mixRice: parseMixRice(responseBody),
  };

  fs.writeFile('../raw_data/meal-hak.json', JSON.stringify(data), (err) => {
    if (err) throw err;
    console.log('OK');
  });
}

function parseKoreanTable(responseBody) {
  let koreanTableInfo = { price: '3,000' };

  if (responseBody.haksik.length == 0) {
    koreanTableInfo.morning = ['오늘은 운영하지 않아요 :)'];
    koreanTableInfo.lunch = ['오늘은 운영하지 않아요 :)'];
    koreanTableInfo.dinner = ['오늘은 운영하지 않아요 :)'];
  } else {
    koreanTableInfo.morning = parseData(responseBody.haksik[0].menu_kor);
    koreanTableInfo.lunch = parseData(responseBody.haksik[1].menu_kor);
    koreanTableInfo.dinner = parseData(responseBody.haksik[2].menu_kor);
  }
  return koreanTableInfo;
}

function parseFryFry(responseBody) {
  const fryFryInfo = {};
  const fryFryBody = responseBody.haksik[3];
  fryFryInfo.menus = parseData(fryFryBody.menu_kor);
  fryFryInfo.prices = parseData(fryFryBody.price, false);

  return fryFryInfo;
}

function parseNoodleRoad(responseBody) {
  const noodleRoadInfo = {};
  const noodleRoadBody = responseBody.haksik[4];
  noodleRoadInfo.menus = parseData(noodleRoadBody.menu_kor);
  noodleRoadInfo.prices = parseData(noodleRoadBody.price, false);

  return noodleRoadInfo;
}

function parseHao(responseBody) {
  const haoInfo = {};
  const haoBody = responseBody.haksik[5];
  haoInfo.menus = parseData(haoBody.menu_kor);
  haoInfo.prices = parseData(haoBody.price, false);

  return haoInfo;
}

function parseGraceGarden(responseBody) {
  const graceGardenInfo = {};
  const graceGardenBody = responseBody.haksik[6];
  graceGardenInfo.menus = parseData(graceGardenBody.menu_kor);
  graceGardenInfo.prices = parseData(graceGardenBody.price, false);

  return graceGardenInfo;
}

function parseMixRice(responseBody) {
  const mixRiceInfo = {};
  const mixRiceBody = responseBody.haksik[7];
  mixRiceInfo.menus = parseData(mixRiceBody.menu_kor);
  mixRiceInfo.prices = parseData(mixRiceBody.price, false);

  return mixRiceInfo;
}

function parseMomsData(responseBody) {
  let momsInfo = { price: '4,000' };
  if (responseBody.moms.length == 0) {
    momsInfo.morning = ['오늘은 운영하지 않아요 :)'];
    momsInfo.lunch = ['오늘은 운영하지 않아요 :)'];
    momsInfo.dinner = ['오늘은 운영하지 않아요 :)'];
  } else {
    momsInfo.morning = parseData(responseBody.moms[0].menu_kor, true, true);
    momsInfo.lunch = parseData(responseBody.moms[1].menu_kor, true, true);
    momsInfo.dinner = parseData(responseBody.moms[2].menu_kor, true, true);
  }

  fs.writeFile(
    '../raw_data/meal-moms.json',
    JSON.stringify(momsInfo),
    (err) => {
      if (err) throw err;
      console.log('OK');
    }
  );
}
function runner() {
  request.get(
    {
      url: 'http://smart.handong.edu/api/service/menu',
    },
    function (response, body) {
      responseBody = JSON.parse(body.body);

      parseHaksikData(responseBody);
      parseMomsData(responseBody);
    }
  );
}

const job = schedule.scheduleJob('1 * * * * *', function () {
  console.log('run scheduled work');
  runner();
});
