const request = require('request');
const requestP = require('request-promise');
const { covidTrackerAPIKey } = require('../keys/apiKeys');

const generalCountUrl =
  'https://api.corona-19.kr/korea/?serviceKey=' + covidTrackerAPIKey;

const cityCountUrl =
  'http://api.corona-19.kr/korea/country/new/?serviceKey=' + covidTrackerAPIKey;

module.exports.covidStatus = async (callback) => {
  const covidText =
    'π¦  μ€λμ μ½λ‘λ19 μν©μ μλ €λλ €μ π¦ \n λ΅λ΅νλλΌκ³  μ£Όμ μΉκ΅¬λ€κ³Ό κ΅μλ, κ΅μ§μλ€μ μν΄ λ§μ€ν¬λ κΌ­ μ°κΈ°λ‘ ν΄μ! π·\n\n';

  let cityKeys = ['city1n', 'city2n', 'city3n', 'city4n', 'city5n'];
  let responseBody = JSON.parse(await requestP.get(generalCountUrl));
  const diffText = responseBody['TotalCaseBefore'] < 0 ? 'κ°μ)' : 'μ¦κ°)';
  const countDiff =
    '(μ μΌλλΉ ' + Math.abs(responseBody['TotalCaseBefore']) + 'λͺ ' + diffText;
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
    covidData += data.cityName === 'ν©κ³' ? countDiff + '\n' : '\n';
  });

  const resultText = covidText + updateTime + '\n\n' + covidData;
  callback(resultText);
};
