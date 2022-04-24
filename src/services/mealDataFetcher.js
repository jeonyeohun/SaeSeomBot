const request = require('request');
const fs = require('fs').promises;

const MORNING_MENU = 0;
const LUNCH_MENU = 1;
const DINNER_MENU = 2;
const FRYFRY = 3;
const NOODLE_ROAD = 4;
const GRACE_GARDEN = 5;
const MIX_RICE = 6;

const jsonSaveDir = '../data/';

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

