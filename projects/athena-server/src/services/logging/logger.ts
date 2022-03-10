import { pino, Logger as PinoLogger } from 'pino';

export class Logger {
  private _logger: PinoLogger = pino({
    transport: {
      target: 'pino-pretty',
      options: {
        colorize: true,
      }
    }
  })

  async log(error: any) {
    this._logger.error(error);
  }
}
