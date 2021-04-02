const request = require('request');
const { busTrackerAPIKey } = require('../keys/apiKeys');

const apiUrl =
  'http://openapi.tago.go.kr/openapi/service/ArvlInfoInqireService/getSttnAcctoSpcifyRouteBusArvlPrearngeInfoList?serviceKey=';
const apiParamToHandong =
  '&cityCode=37010&nodeId=PHB351016075&routeId=PHB350000233&_type=json';
const apiParamToYangdeok =
  '&cityCode=37010&nodeId=PHB350099178&routeId=PHB350000233&_type=json';

function convertSecToMin(seconds) {
  const hour = parseInt(seconds / 3600);
  const min = parseInt((seconds % 3600) / 60);

  return { hour: hour, min: min };
}

function generateArrivalTimeText(convertedTime) {
  let timeText;
  if (convertedTime.hour)
    timeText = convertedTime.hour + '시간 ' + convertedTime.min + '분';
  else timeText = convertedTime.min + '분';

  return timeText;
}

function generateBusText(isToHandong, infos) {
  if (!infos) return '지금은 운행 중인 302번 버스가 없어요 😔\n';
  info = infos[0];
  const convertedTime = convertSecToMin(info.arrtime);
  const timeText = generateArrivalTimeText(convertedTime);

  const startPoint = isToHandong ? '양덕 농협' : '한동대';
  const destination = isToHandong ? '한동대행' : '양덕행';
  const initialText =
    '[ ' +
    timeText +
    ' 뒤에 ' +
    destination +
    ' 버스가 ' +
    startPoint +
    '에 도착해요! 🚌]\n\n';

  const cntText =
    '지금 302번 버스는 ' +
    info.arrprevstationcnt +
    '번째 전 정류장에 있어요!\n';

  const arrivalTimeText =
    '\n제 정보통에 따르면..🤖 \n아마도 ' +
    generateArrivalTimeText(convertedTime) +
    ' 정도 뒤에 도착할 것 같네요..!\n정확한 시간은 아니니 조금만 서둘러서 움직이는게 좋아요.\n';

  let nextBusText = '\n다음 버스는 ';
  let nextTimes = [];

  for (let i = 1; i < infos.length; i++) {
    nextTimes.push(generateArrivalTimeText(convertSecToMin(infos[i].arrtime)));
  }

  if (nextTimes.length == 0) {
    nextBusText =
      '\n다음 버스에 대한 정보는 아직 없어요..! 잠시 뒤에 오시면 알아올게요!!';
  } else {
    nextBusText += nextTimes.join('분, ') + ' 뒤에 또 있어요 🐥';
  }

  const handongText =
    "\n\n⛔️ 한동대 도착시간은 '한동대입구' 정류장을 기준으로 알려드려요! 한동대에서 출발하는 시간이 아니라 한동대에 도착하는 시간이에요!";

  if (isToHandong) {
    return initialText + cntText + arrivalTimeText + nextBusText;
  } else {
    return initialText + cntText + arrivalTimeText + nextBusText + handongText;
  }
}

function parseTimeAndStation(arrivalInfo) {
  if (!arrivalInfo) return null;
  let timeAndStationCnt = [];
  if (Array.isArray(arrivalInfo)) {
    arrivalInfo.forEach((info) => {
      timeAndStationCnt.push(
        (({ arrprevstationcnt, arrtime }) => ({
          arrprevstationcnt,
          arrtime,
        }))(info)
      );
    });
  } else {
    timeAndStationCnt.push(
      (({ arrprevstationcnt, arrtime }) => ({
        arrprevstationcnt,
        arrtime,
      }))(arrivalInfo)
    );
  }
  return timeAndStationCnt;
}

module.exports.arrivalInfoToHandong = (callback) => {
  const url = apiUrl + busTrackerAPIKey + apiParamToHandong;
  request.get(url, (response, body) => {
    responseBody = JSON.parse(body.body);

    const arrivalInfo = responseBody.response.body.items.item;
    let timeAndStationCnt = parseTimeAndStation(arrivalInfo);

    timeAndStationCnt.sort((a, b) => {
      return a.arrtime - b.arrtime;
    });

    const resultText = generateBusText(true, timeAndStationCnt);
    console.log(resultText);
    // callback(resultText);
  });
};

module.exports.arrivalInfoToYangdeok = (callback) => {
  const url = apiUrl + busTrackerAPIKey + apiParamToYangdeok;
  request.get(url, (response, body) => {
    responseBody = JSON.parse(body.body);

    const arrivalInfo = responseBody.response.body.items.item;
    let timeAndStationCnt = parseTimeAndStation(arrivalInfo);

    if (timeAndStationCnt)
      timeAndStationCnt.sort((a, b) => {
        return a.arrtime - b.arrtime;
      });

    const resultText = generateBusText(false, timeAndStationCnt);
    // callback(resultText);
  });
};
