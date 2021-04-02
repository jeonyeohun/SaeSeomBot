const express = require('express');
const app = express();
const haksik = require('./api/haksik');
const moms = require('./api/moms');
const weather = require('./api/weather');
const bus = require('./api/bus');
const schedule = require('node-schedule');
const { updateHaksikData } = require('./services/dailyHaksikDataGenerator');

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use('/moms', moms);
app.use('/haksik', haksik);
app.use('/weather', weather);
app.use('/bus', bus);

schedule.scheduleJob('0 0 * * * *', function () {
  console.log('run scheduled work');
  updateHaksikData();
});

app.listen(3000, () => console.log('node on 3000'));
