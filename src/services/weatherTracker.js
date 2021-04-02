const request = require('request');
const { openWeatherAPIKey } = require('../keys/apiKeys');

const weatherCondition = {
  Thunderstorm: '🌩 천둥번개가',
  Drizzle: '🌦 가벼운 비가',
  Rain: '☔️ 비가',
  Snow: '☃️ 눈이',
  Mist: '💨 안개가',
  Smoke: '💨 매연이',
  Haze: '💨 안개가',
  Dust: '😷 미세먼지가',
  Clear: '☀️ 맑은 하늘이',
  Clouds: '☁️ 구름이',
};

const weatherMessage = {
  Thunderstorm: '오늘은 기숙사에만 있는게 좋겠네요..⚡️⚡️',
  Drizzle: '혹시 모르니 우산은 꼭 챙기자구요! 🌂',
  Rain:
    '오늘은 우산이 꼭 필요할거에요! 주변 친구들이 우산을 챙겼는지 물어봐주세요! ☔️',
  Snow:
    '한동에서 눈이라니..! 이건 날마다 오는 기회가 아니라구요!! 꼭 나가서 사진찍어요 우리!☃️',
  Mist: '오늘같은 날은 안전운전 해야되는거 아시죠?? 🛻',
  Smoke: '이런 날은 안나가는게 제일 좋아요!',
  Haze: '오늘같은 날은 안전운전 해야되는거 아시죠?? 🛻',
  Dust: '오늘은 답답하더라도 KF94가 필수!!😷',
  Clear:
    '한동 등록금의 반 값이 하늘 값이라는거 아시나요? 저는 이런 날엔 뉴턴 앞 벤치에 앉아서 광합성을 한답니다 🌱',
  Clouds: '우중충한 날씨이지만, 소확행으로 가득 찬 하루가 되었으면 좋겠어요!😊',
};

const apiUrl =
  'https://api.openweathermap.org/data/2.5/onecall?lat=36.102831&lon=129.389150&appid=' +
  openWeatherAPIKey +
  '&lang=kr&exclude=minutely,hourly,daily,alerts&units=metric';

function generateText(currentWeather) {
  const currentWeatherDescription =
    '지금 한동의 기온은 ' +
    currentWeather.temp +
    '도 이고, ' +
    weatherCondition[currentWeather.weather[0].main] +
    ' 있는 날씨에요!\n' +
    weatherMessage[currentWeather.weather[0].main];

  return currentWeatherDescription;
}

module.exports.weatherForecast = async (callback) => {
  request.get(apiUrl, (response, body) => {
    responseBody = JSON.parse(body.body);
    const result = generateText(responseBody.current);
    callback(result);
  });
};
