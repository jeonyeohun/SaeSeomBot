const request = require('request');
const requestP = require('request-promise');
const { covidTrackerAPIKey } = require('../keys/apiKeys');

const generalCountUrl =
  'https://api.corona-19.kr/korea/?serviceKey=' + covidTrackerAPIKey;

const cityCountUrl =
  'http://api.corona-19.kr/korea/country/new/?serviceKey=' + covidTrackerAPIKey;

module.exports.covidStatus = async (callback) => {
  const covidText =
    '🦠 오늘의 코로나19 상황을 알려드려요 🦠\n 답답하더라고 주위 친구들과 교수님, 교직원들을 위해 마스크는 꼭 쓰기로 해요! 😷\n\n';

  let cityKeys = ['city1n', 'city2n', 'city3n', 'city4n', 'city5n'];
  let responseBody = JSON.parse(await requestP.get(generalCountUrl));
  const countDiff = '(전일대비 ' + responseBody['TotalCaseBefore'] + ')';
  const updateTime = responseBody.updateTime;

  let cities = {};

  cityKeys.forEach((key) => {
    cities[responseBody[key]] = '0';
  });

  responseBody = JSON.parse(await requestP.get(cityCountUrl));

  console.log(responseBody);
  let arr = [];
  for (let entry in responseBody) {
    let city = responseBody[entry];

    if (city.countryName != undefined) {
      arr.push({
        cityName: city.countryName,
        newCase: city.newCase,
      });
    }
  }

  arr.sort((a, b) => parseInt(b.newCase - a.newCase));

  let covidData = '';
  arr.forEach((data) => {
    covidData += data.cityName + ' : ' + data.newCase;
    covidData += data.cityName === '합계' ? countDiff + '\n' : '\n';
  });

  const resultText = covidText + updateTime + '\n\n' + covidData;
  callback(resultText);
};
