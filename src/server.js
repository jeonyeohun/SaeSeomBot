const express = require('express');
const app = express();
const haksik = require('./api/haksik');
const moms = require('./api/moms');
const weather = require('./api/weather');

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use('/moms', moms);
app.use('/haksik', haksik);
app.use('/weather', weather);

app.listen(3000, () => console.log('node on 3000'));
