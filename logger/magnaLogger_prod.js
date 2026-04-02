import { createLogger, format, transports } from 'winston';
const { combine, timestamp, label, printf, json } = format;

const magnaLoggerProd = () =>
{
     
  return createLogger({
    level: 'debug',
    // format: winston.format.simple(),
    format: combine(
        timestamp(),
        json()
      ),

    defaultMeta: { service: 'user-service' },
    transports: [
        new transports.Console(),
        new transports.File({ filename: 'errors.log', level: 'error' }),
        new transports.File({ filename: 'combined.log' }),
    ],
  });
}

export default magnaLoggerProd;