import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Request } from 'express';
import { Observable } from 'rxjs';

@Injectable()
export class RMSRequestLogInterceptor implements NestInterceptor {
  private readonly logger = new Logger('LogInterceptor');
  private readonly httpMethodWithBody = ['POST', 'UPDATE', 'PATCH'];

  public intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    const request: Request = context.switchToHttp().getRequest();
    let message = `[HTTP Request]: ${request.method} ${request.url}`;

    if (this.checkForBody(request)) {
      message =
        message + `\n\t[Request Body] => ${JSON.stringify(request.body)}`;
    }
    this.logger.verbose(message);
    return next.handle();
  }

  private checkForBody(request: Request): boolean {
    return this.httpMethodWithBody.some((x) => x === request.method);
  }
}
