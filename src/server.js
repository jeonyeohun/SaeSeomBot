const express = require('express');
const app = express();
const haksik = require('./api/haksik');
const moms = require('./api/moms');
const weather = require('./api/weather');
const bus = require('./api/bus');
const schedule = require('node-schedule');
const covid = require('./api/covid');

const { updateHaksikData } = require('./services/dailyHaksikDataGenerator');

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use('meal/moms/today', moms)
app.use('meal/moms/tomorrow', moms)
app.use('meal/haksik/today', haksik)
app.use('meal/haksik/tomorrow', haksik)
app.use('/weather', weather);
app.use('/bus', bus);
app.use('/covid', covid);

schedule.scheduleJob('1 0 * * * *', function () {
  updateHaksikData();
});

app.listen(3000, () => console.log('node on 3000'));
