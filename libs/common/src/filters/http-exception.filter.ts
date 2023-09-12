import {
  ArgumentsHost,
  Catch,
  HttpException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { Request, Response } from 'express';

@Catch()
export class HttpExceptionFilter extends BaseExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const shouldResponseWrapped = this.shouldResponseWrapped(request);
    if (!(exception instanceof HttpException)) {
      this.logger.error(
        (exception as Error).message,
        (exception as Error).stack,
      );
      exception = new InternalServerErrorException(exception);
    }

    const status = exception.getStatus();
    const exceptionDetails = exception.getResponse();

    response
      .status(shouldResponseWrapped ? 200 : status)
      .send(this.mapError(exceptionDetails, shouldResponseWrapped));
  }

  private shouldResponseWrapped(request: Request): boolean {
    const requestResponseType: string =
      (request.headers['x-response'] as string) ||
      (request.query.response as string);

    return requestResponseType &&
      requestResponseType.toLocaleLowerCase() === 'wrapped'
      ? true
      : false;
  }

  private mapError(message: any, shouldResponseWrapped = false) {
    message = this.buildErrorMessage(message);
    return shouldResponseWrapped
      ? Object.assign(message, { result: null, status: 'failed' })
      : message;
  }

  private buildErrorMessage(message: any) {
    const errorMessage = {} as any;
    if (message.hasOwnProperty('error')) {
      errorMessage.error_name = message.error;
    }
    if (message.hasOwnProperty('message')) {
      errorMessage.message = message.message;
    }
    if (message.hasOwnProperty('statusCode')) {
      errorMessage.code = message.statusCode;
    }
    return errorMessage;
  }
}
