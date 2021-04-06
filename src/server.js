const express = require('express');
const fs = require('fs');
const app = express();
const haksik = require('./api/haksik');
const moms = require('./api/moms');
const weather = require('./api/weather');
const bus = require('./api/bus');
const schedule = require('node-schedule');
const counterData = require('./models/countData');
const { getToday } = require('./utils/dateParser');
const { updateHaksikData } = require('./services/dailyHaksikDataGenerator');

let counter = { ...counterData };

app.use(function (req, res, next) {
  const type = req.url.slice(req.url.lastIndexOf('/'));
  counter[type]++;
  counter[type + 'Total']++;
  next();
});

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use('/moms', moms);
app.use('/haksik', haksik);
app.use('/weather', weather);
app.use('/bus', bus);

schedule.scheduleJob('1 0 0 * * *', function () {
  updateHaksikData();
});

schedule.scheduleJob('1 59 * * * *', function () {
  const hrs = new Date().getHours();
  const dir = '../log/' + getToday();
  const fileDir = '/' + hrs + '.json';

  if (!fs.existsSync(dir)) fs.mkdirSync(dir);
  fs.writeFileSync(dir + fileDir, JSON.stringify(counter), { flag: 'w' });

  counter =
    hrs == 23
      ? {
          ...counter,
          weather: 0,
          toHandong: 0,
          toYangdeok: 0,
          haksik: 0,
          moms: 0,
        }
      : {
          ...counterData,
        };
});

app.listen(3000, () => console.log('node on 3000'));
