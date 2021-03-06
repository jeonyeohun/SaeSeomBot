const requestP = require('request-promise');
const { openWeatherAPIKey, dustAPIKey } = require('../keys/apiKeys');

const weatherCondition = {
  Thunderstorm: 'π© μ²λ₯λ²κ°κ°',
  Drizzle: 'π¦ κ°λ²Όμ΄ λΉκ°',
  Rain: 'βοΈ λΉκ°',
  Snow: 'βοΈ λμ΄',
  Mist: 'π¨ μκ°κ°',
  Smoke: 'π¨ λ§€μ°μ΄',
  Haze: 'π¨ μκ°κ°',
  Dust: 'π· λ―ΈμΈλ¨Όμ§κ°',
  Clear: 'βοΈ λ§μ νλμ΄',
  Clouds: 'βοΈ κ΅¬λ¦μ΄',
};

const weatherMessage = {
  Thunderstorm: 'μ€λμ κΈ°μμ¬μλ§ μλκ² μ’κ² λ€μ..β‘οΈβ‘οΈ',
  Drizzle: 'νΉμ λͺ¨λ₯΄λ μ°μ°μ κΌ­ μ±κΈ°μκ΅¬μ! π',
  Rain:
    'μ€λμ μ°μ°μ΄ κΌ­ νμν κ±°μμ! μ£Όλ³ μΉκ΅¬λ€μκ² μ°μ°μ μ±κ²Όλμ§ λ¬Όμ΄λ΄μ£ΌμΈμ! π',
  Snow:
    'νλμμ λμ΄λΌλ..! μ΄κ±΄ λ λ§λ€ μ€λ κΈ°νκ° μλλΌκ΅¬μ!! κΌ­ λκ°μ μ¬μ§μ°μ΄μ μ°λ¦¬!βοΈ',
  Mist: 'μ€λκ°μ λ μ μμ μ΄μ  ν΄μΌλλκ±° μμμ£ ?? π»',
  Smoke: 'μ΄λ° λ μ μλκ°λκ² μ μΌ μ’μμ!',
  Haze: 'μ€λκ°μ λ μ μμ μ΄μ  ν΄μΌλλκ±° μμμ£ ?? π»',
  Dust: 'μ€λμ λ΅λ΅νλλΌλ KF94κ° νμ!!π·',
  Clear:
    'νλ λ±λ‘κΈμ λ° κ°μ΄ νλ κ°μ΄λΌλκ±° μμλμ? μ λ μ΄λ° λ μ λ΄ν΄ μ λ²€μΉμ μμμ κ΄ν©μ±μ νλ΅λλ€ π±',
  Clouds: 'μ°μ€μΆ©ν λ μ¨μ΄μ§λ§, μννμΌλ‘ κ°λ μ°¬ νλ£¨κ° λμμΌλ©΄ μ’κ² μ΄μ!π',
};

const apiUrl =
  'https://api.openweathermap.org/data/2.5/onecall?lat=36.102831&lon=129.389150&appid=' 
  + openWeatherAPIKey 
  + '&lang=kr&exclude=minutely,hourly,alerts&units=metric';

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
    'μ§κΈ νλμ κΈ°μ¨μ ' +
    currentWeather.temp +
    'λ μ΄κ³ , ' +
    weatherCondition[currentWeather.weather[0].main] +
    ' μλ λ μ¨μμ!\n\n' +
    weatherMessage[currentWeather.weather[0].main];

  let todayWeatherDescription =
    '\n\nκ·Έλ¦¬κ³  λ μ¨ μμ μ΄ μ€λμ μ΅κ³  κΈ°μ¨μ ' +
    parseInt(maxTemp) +
    'λ, μ΅μ  κΈ°μ¨μ ' +
    parseInt(minTemp) +
    'λλΌκ³  μλ €μ€¬μ΄μ!\n';

  todayWeatherDescription +=
    maxTemp - minTemp >= 10
      ? 'μ€λμ μΌκ΅μ°¨κ° ν° νλ£¨μμ, κ°κΈ°κ±Έλ¦¬μ§ μκ² μ‘°μ¬ν΄μ π’\n\n'
      : '\n';

  return currentWeatherDescription + todayWeatherDescription;
}

function generateDustText(responseBody) {
  const dustCast = responseBody.response.body.items;
  if (dustCast.length === 0)
    return 'μ€λμ λ―ΈμΈλ¨Όμ§ μλ³΄λ μ€μ  5μμ μλ°μ΄νΈ λμ΄μ! μμΉ¨μ λ€μ νμΈν΄μ£ΌμΈμ..!\n\n';
  let dustStatusString = dustCast[0].informGrade;
  let idx = dustStatusString.indexOf('κ²½λΆ : ');
  const pm10Status = dustStatusString.slice(
    idx + 5,
    dustStatusString.indexOf(',', idx)
  );
  dustStatusString = dustCast[1].informGrade;
  idx = dustStatusString.indexOf('κ²½λΆ : ');
  const pm25Status = dustStatusString.slice(
    idx + 5,
    dustStatusString.indexOf(',', idx)
  );

  return (
    'μ€λ κ²½μλΆλμ λ―ΈμΈλ¨Όμ§ μνλ "' +
    pm10Status +
    '", μ΄λ―ΈμΈλ¨Όμ§ μνλ "' +
    pm25Status +
    '" μ΄μμ! λ§μ€ν¬λ νμμΈκ±° μμμ£ ?? π·\n\n'
  );
}

module.exports.weatherForecast = async (callback) => {
  responseBody = JSON.parse(await requestP.get(apiUrl));
  const weatherText = generateWeatherText(responseBody);
  responseBody = JSON.parse(await requestP.get(generateDustUrl()));

  const dustText = generateDustText(responseBody);
  const lastText =
    'λ μ¨μμ μ΄ μ¬λ¬λΆλ€μ νλ£¨λ₯Ό μμνκ³  μμ΄μ π§ \nμ€λλ μ ν΄λ΄κ³  μμ΄μ, μ’μ νλ£¨ λ³΄λ΄μ! πͺ';
  callback(weatherText + dustText + lastText);
};
