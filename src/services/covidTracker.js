const request = require('request');
const { covidTrackerAPIKey } = require('../keys/apiKeys');

const apiUrl =
  'https://api.corona-19.kr/korea/country/new/?serviceKey=' +
  covidTrackerAPIKey;

module.exports.covidStatus = async (callback) => {
  request.get(apiUrl, (response, body) => {
    console.log(body);
    responseBody = JSON.parse(body.body);
    let covidText =
      '🦠 오늘의 코로나19 상황을 알려드려요 🦠\n 답답하더라고 주위 친구들과 교수님, 교직원들을 위해 마스크는 꼭 쓰기로 해요! 😷\n\n';
    for (let key in responseBody) {
      if (responseBody[key]['countryName'] != undefined) {
        covidText =
          covidText +
          responseBody[key]['countryName'] +
          ' : ' +
          responseBody[key]['newCase'] +
          '명\n';
      }
    }
    console.log(covidText);
    callback(covidText);
  });
};
