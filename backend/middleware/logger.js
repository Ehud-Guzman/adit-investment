import { v4 as uuidv4 } from 'uuid'
import pino from 'pino' // Modern, fast logger
import pinoHttp from 'pino-http'

// Create a Pino logger instance
const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  formatters: {
    level: (label) => ({ level: label.toUpperCase() })
  },
  timestamp: () => `,"time":"${new Date().toISOString()}"`
})

// HTTP request logger middleware
const httpLogger = pinoHttp({
  logger,
  genReqId: (req) => {
    req.id = uuidv4()
    return req.id
  },
  serializers: {
    req: (req) => ({
      id: req.id,
      method: req.method,
      url: req.url,
      headers: {
        host: req.headers.host,
        origin: req.headers.origin,
        'user-agent': req.headers['user-agent']
      }
    }),
    res: (res) => ({
      statusCode: res.statusCode
    })
  },
  customLogLevel: (res, err) => {
    if (res.statusCode >= 400 && res.statusCode < 500) {
      return 'warn'
    } else if (res.statusCode >= 500 || err) {
      return 'error'
    }
    return 'info'
  }
})

// Error handler middleware
const errorHandler = (err, req, res, next) => {
  logger.error({
    message: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
    requestId: req.id
  })

  const statusCode = err.statusCode || 500
  const response = {
    status: 'error',
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  }

  res.status(statusCode).json(response)
}

export { logger, httpLogger, errorHandler }