import * as winston from 'winston';
import 'winston-daily-rotate-file';

export class LoggerConfig {
  private readonly options: winston.LoggerOptions;
  private timezoned = () => {
    return new Date().toLocaleString('en-US', {
      timeZone: 'Asia/Bangkok',
    });
  };
  private format = winston.format.combine(
    winston.format.timestamp({ format: this.timezoned }),
    winston.format.printf((msg) => {
      return `${msg.timestamp} [${msg.level}] - ${msg.message}`;
    }),
  );

  constructor() {
    this.options = {
      exitOnError: false,
      format: this.format,
      transports: [
        new winston.transports.DailyRotateFile({
          dirname: './log/debug',
          filename: 'debug.log',
          level: 'debug',
          maxSize: '1m',
          maxFiles: '1d',
          handleExceptions: true,
          json: true,
          datePattern: 'YYYY-MM-DD',
        }),
        new winston.transports.DailyRotateFile({
          dirname: './log/error/',
          filename: 'error.log',
          level: 'error',
          maxSize: '1m',
          maxFiles: '1d',
          handleExceptions: true,
          json: true,
          datePattern: 'YYYY-MM-DD',
        }),
        new winston.transports.DailyRotateFile({
          dirname: './log/info',
          filename: 'info.log',
          level: 'info',
          maxSize: '1m',
          maxFiles: '1d',
          handleExceptions: true,
          json: true,
          datePattern: 'YYYY-MM-DD',
        }),
        new winston.transports.Console({ level: 'info' }),
      ],
    };
  }

  public getOption(): object {
    return this.options;
  }
}
