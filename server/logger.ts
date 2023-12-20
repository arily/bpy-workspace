import winston from 'winston'

export const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  defaultMeta: { service: 'user-service' },
  transports: [
    //
    // - Write all logs with importance level of `error` or less to `error.log`
    // - Write all logs with importance level of `info` or less to `combined.log`
    //
    // new winston.transports.File({ filename: 'error.log', level: 'error' }),
    // new winston.transports.File({ filename: 'combined.log' }),

    // eslint-disable-next-line n/prefer-global/process
    process.env.NODE_ENV !== 'production' && new winston.transports.Console({
      format: winston.format.simple(),
    }),

  ].filter(Boolean as unknown as <V>(v: V | false | null | undefined) => v is V),
})
