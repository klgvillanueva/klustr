const fetch = require('node-fetch');

const jmxController = {};

// fetch request from Slack
jmxController.getMetrics = (req, res, next) => {
  console.time();
  // fetch('http://23.20.153.187:7075/')
  fetch(`http://${req.params.port}/`)
    .then((response) => {
      return response.text();
    })
    .then((response) => {
      let strResponse = String(response);
      res.locals.response = strResponse;
      return next();
    });
};

jmxController.getActiveControllers = (req, res, next) => {
  // activecontrollercount 123423452.0
  const matches = res.locals.response.match(/activecontrollercount \d+.\d+/g);
  const convertedToNum = Number(matches[0].match(/\d.*/g)[0]);
  res.locals.activeControllers = convertedToNum;
  return next();
};

jmxController.getReplicatedPartitions = (req, res, next) => {
  const matches = res.locals.response.match(/replicatedpartitions \d+.\d+/g);
  const convertedToNum = Number(matches[0].match(/\d.*/g)[0]);
  res.locals.replicatedPartitions = convertedToNum;
  return next();
};

jmxController.getOfflinePartitions = (req, res, next) => {
  const matches = res.locals.response.match(/offlinepartitionscount \d+.\d+/g);
  const convertedToNum = Number(matches[0].match(/\d.*/g)[0]);
  res.locals.offlinePartitions = convertedToNum;
  return next();
};

jmxController.getAdvancedMetrics = (req, res, next) => {
  req.body.metrics.forEach((metric) => {
    const metricStr = metric + ' \\d+.\\d+';
    const matchStr = new RegExp(metricStr, 'g');
    const matches = res.locals.response.match(matchStr);
    const convertedToNum = Number(matches[0].match(/\d.*/g)[0]);
    res.locals[metric] = convertedToNum;
  });
  delete res.locals.response;
  return next();
};

// brokertopicmetrics_bytesin_total
jmxController.getBytesInTotal = (req, res, next) => {
  const matches = res.locals.response.match(
    /brokertopicmetrics_bytesin_total \d+.\d+/g
  );
  const convertedToNum = Number(matches[0].match(/\d.*/g)[0]);
  res.locals.brokerBytesIn = convertedToNum;
  return next();
};

// brokertopicmetrics_bytesout_total
jmxController.getBytesOutTotal = (req, res, next) => {
  const matches = res.locals.response.match(
    /brokertopicmetrics_bytesout_total \d+.\d+/g
  );
  const convertedToNum = Number(matches[0].match(/\d.*/g)[0]);
  res.locals.brokerBytesOut = convertedToNum;
  return next();
};

module.exports = jmxController;