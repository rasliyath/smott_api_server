import magnaLoggerDev from "./magnLogger_dev.js";
import magnaLoggerProd from "./magnaLogger_prod.js"
let logger = null;

if (process.env.NODE_ENV !== 'production') {
   logger=magnaLoggerDev();
  }
  else
  {
    logger=magnaLoggerProd();
  }

export default logger;