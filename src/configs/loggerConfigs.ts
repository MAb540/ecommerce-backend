import { format, transports } from 'winston';

import { utilities as nestWinstonModuleUtilities } from 'nest-winston';

export const loggingConfigObj = {
  level: 'info',
  format: format.combine(
    format.timestamp({ format: 'isoDateTime' }),
    format.ms(),
    nestWinstonModuleUtilities.format.nestLike('my app', {
      prettyPrint: true,
    }),
    format.colorize({ all: true }),
  ),
  transports: [
    new transports.Console(),
    // new transports.File({ filename: 'error.log', level: 'error' }),
  ],
};
