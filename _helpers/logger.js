var winston = require('winston');

const logger = winston.createLogger({
  format: winston.format.json(),
  transports: [new winston.transports.File({ filename: '/var/log/combined.log'})],
});

module.exports = logger;