const NodeCache = require('node-cache');

const weatherCache = new NodeCache({ stdTTL: 300, checkperiod: 60 });

module.exports = weatherCache;