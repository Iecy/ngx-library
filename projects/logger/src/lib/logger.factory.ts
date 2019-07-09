import { LoggerService } from './logger.service';

export function loggerFactory(enable: boolean): LoggerService {
  return new LoggerService(enable);
}
