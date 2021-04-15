const requestP = require('request-promise');
const { openWeatherAPIKey, dustAPIKey } = require('../keys/apiKeys');

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
    '오늘은 우산이 꼭 필요할거에요! 주변 친구들에게 우산을 챙겼는지 물어봐주세요! 🌂',
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

// TODO: Add wind speed
const windSpeedMessage = {
  noWind: '오늘은 바람이 많이 불지는 않아요!',
  weakWind: '오늘은 가볍게 바람이 부는 날씨네요!',
  strongWind: '오늘은 바람이 무척 강해요! 잘 챙겨입고 나가세요!',
};

const apiUrl =
  'https://api.openweathermap.org/data/2.5/onecall?lat=36.102831&lon=129.389150&appid=' +
  openWeatherAPIKey +
  '&lang=kr&exclude=minutely,hourly,alerts&units=metric';

function generateDustUrl() {
  let date = new Date();
  let year = date.getFullYear();
  let month = ('0' + (1 + date.getMonth())).slice(-2);
  let day = ('0' + date.getDate()).slice(-2);

  const todayDate = year + '-' + month + '-' + day;

  return `http://apis.data.go.kr/B552584/ArpltnInforInqireSvc/getMinuDustFrcstDspth?serviceKey=${dustAPIKey}&returnType=json&numOfRows=100javascript:fn_preview(%27pre%27)&pageNo=1&searchDate=${todayDate}&InformCode=PM25`;
}

function generateWeatherText(weather) {
  const currentWeather = weather.current;
  const minTemp = weather.daily[0].temp.min;
  const maxTemp = weather.daily[0].temp.max;

  const currentWeatherDescription =
    '지금 한동의 기온은 ' +
    currentWeather.temp +
    '도 이고, ' +
    weatherCondition[currentWeather.weather[0].main] +
    ' 있는 날씨에요!\n\n' +
    weatherMessage[currentWeather.weather[0].main];

  let todayWeatherDescription =
    '\n\n그리고 날씨 요정이 오늘의 최고 기온은 ' +
    parseInt(maxTemp) +
    '도, 최저 기온은 ' +
    parseInt(minTemp) +
    '도라고 알려줬어요! \n\n';

  todayWeatherDescription +=
    maxTemp - minTemp >= 10
      ? '오늘은 일교차가 큰 하루에요, 감기걸리지 않게 조심해요 😢\n\n'
      : '\n\n';

  return currentWeatherDescription + todayWeatherDescription;
}

function generateDustText(responseBody) {
  const dustCast = responseBody.response.body.items;
  let dustStatusString = dustCast[0].informGrade;
  let idx = dustStatusString.indexOf('경북 : ');
  const pm10Status = dustStatusString.slice(
    idx + 5,
    dustStatusString.indexOf(',', idx)
  );
  dustStatusString = dustCast[1].informGrade;
  idx = dustStatusString.indexOf('경북 : ');
  const pm25Status = dustStatusString.slice(
    idx + 5,
    dustStatusString.indexOf(',', idx)
  );

  return (
    '오늘 경상북도의 미세먼지 상태는 "' +
    pm10Status +
    '", 초 미세먼지 상태는 "' +
    pm25Status +
    '" 이에요! 마스크는 필수인거 아시죠?? 😷\n\n'
  );
}

module.exports.weatherForecast = async (callback) => {
  responseBody = JSON.parse(await requestP.get(apiUrl));
  const weatherText = generateWeatherText(responseBody);

  console.log(generateDustUrl());
  responseBody = JSON.parse(await requestP.get(generateDustUrl()));

  const dustText = generateDustText(responseBody);
  const lastText =
    '날씨요정이 여러분들의 하루를 응원하고 있어요 🧚 \n오늘도 잘 사아내고 있어요, 좋은 하루 보내요! 💪';

  console.log(weatherText + dustText + lastText);

  callback(weatherText + dustText + lastText);
};
