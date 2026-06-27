import logger from '../utils/logger.js';

const errorHandler = (err, req, res, next) => {
  logger.error(
    {
      err: {
        message: err.message,
        stack: err.stack,
        code: err.code,
      },
      request: {
        method: req.method,
        url: req.url,
        ip: req.ip,
      },
    },
    'Uncaught server error'
  );

  const status = err.status || err.statusCode || 500;
  const message = status === 500 ? 'Internal Server Error' : err.message;

  const responsePayload = {
    success: false,
    message,
  };

  if (process.env.NODE_ENV === 'development') {
    responsePayload.stack = err.stack;
  }

  res.status(status).json(responsePayload);
};

export default errorHandler;
