const express = require('express');
const bodyParser = require('body-parser');
const directionsRouter = require('./ors/ors_api');

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
})

app.use('/api', directionsRouter);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
