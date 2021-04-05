const express = require('express');
const fs = require('fs');
const app = express();
const haksik = require('./api/haksik');
const moms = require('./api/moms');
const weather = require('./api/weather');
const bus = require('./api/bus');
const schedule = require('node-schedule');
const { getToday } = require('./utils/dateParser');
const { updateHaksikData } = require('./services/dailyHaksikDataGenerator');

let counter = {
  weather: 0,
  bus: 0,
  haksik: 0,
  moms: 0,
};

app.use(function (req, res, next) {
  counter[req.url.slice(1)]++;
  next();
});

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use('/moms', moms);
app.use('/haksik', haksik);
app.use('/weather', weather);
app.use('/bus', bus);

schedule.scheduleJob('1 0 0 * * *', function () {
  console.log('update meal data');
  updateHaksikData();
});

schedule.scheduleJob('1 0 * * * *', function () {
  console.log('save log');

  const date = new Date();
  const dir = '../log/' + getToday();
  const fileDir = '/' + date.getHours() + '.json';

  if (!fs.existsSync(dir)) fs.mkdirSync(dir);
  fs.writeFileSync(dir + fileDir, JSON.stringify(counter), { flag: 'w' });
});

app.listen(3000, () => console.log('node on 3000'));
