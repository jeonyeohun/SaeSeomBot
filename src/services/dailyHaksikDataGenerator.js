const request = require('request');
const fs = require('fs').promises;

const MORNING_MENU = 0;
const LUNCH_MENU = 1;
const DINNER_MENU = 2;
const FRYFRY = 3;
const NOODLE_ROAD = 4;
const HAO = 5;
const GRACE_GARDEN = 6;
const MIX_RICE = 7;

const jsonSaveDir = '../data/';

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

function parseGeneralMealData(section, index) {
  const data = {};
  const corner = section[index];
  data.menus = parseData(corner.menu_kor);
  data.prices = parseData(corner.price, false);

  return data;
}

function saveJSON(data, isMomsData = false) {
  const dir = isMomsData
    ? jsonSaveDir + 'meal-moms.json'
    : jsonSaveDir + 'meal-hak.json';

  fs.writeFile(dir, JSON.stringify(data), (err) => {
    if (err) throw err;
  });
}

function parseTimeMealData(corner, price, isMomsData = false) {
  let data = { price: price };
  if (corner.length == 0) {
    data.morning = ['오늘은 운영하지 않아요 :)'];
    data.lunch = ['오늘은 운영하지 않아요 :)'];
    data.dinner = ['오늘은 운영하지 않아요 :)'];
  } else {
    data.morning = parseData(corner[MORNING_MENU].menu_kor, true, isMomsData);
    data.lunch = parseData(corner[LUNCH_MENU].menu_kor, true, isMomsData);
    data.dinner = parseData(corner[DINNER_MENU].menu_kor, true, isMomsData);
  }
  return data;
}

function parseHaksikData(responseBody) {
  const data = {
    koreanTable: parseTimeMealData(responseBody.haksik, '3,000'),
    fryFry: parseGeneralMealData(responseBody.haksik, FRYFRY),
    noodleRoad: parseGeneralMealData(responseBody.haksik, NOODLE_ROAD),
    hao: parseGeneralMealData(responseBody.haksik, HAO),
    graceGarden: parseGeneralMealData(responseBody.haksik, GRACE_GARDEN),
    mixRice: parseGeneralMealData(responseBody.haksik, MIX_RICE),
  };
  saveJSON(data, false);
}

function parseMomsData(responseBody) {
  const data = parseTimeMealData(responseBody.moms, '4,000', true);
  saveJSON(data, true);
}

module.exports.updateHaksikData = () => {
  request.get(
    {
      url: 'http://smart.handong.edu/api/service/menu',
    },
    function (response, body) {
      responseBody = JSON.parse(body.body);

      parseMomsData(responseBody);
      parseHaksikData(responseBody);
    }
  );
};
