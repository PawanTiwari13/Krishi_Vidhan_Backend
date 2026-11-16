import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ApiResponse } from '../dto/api-response.dto';

@Catch()
export class GlobalHttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalHttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
    let errorCode = 'INTERNAL_SERVER_ERROR';
    let details: string | string[] = 'An unexpected server error occurred';

    if (exception instanceof HttpException) {
      statusCode = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      if (typeof exceptionResponse === 'string') {
        details = exceptionResponse;
        errorCode = exception.name.replace(/Exception$/, '').toUpperCase();
      } else if (
        typeof exceptionResponse === 'object' &&
        exceptionResponse !== null
      ) {
        const resObj = exceptionResponse as Record<string, unknown>;
        details = (resObj.message as string | string[]) || exception.message;
        errorCode =
          (resObj.error as string)?.toUpperCase().replace(/\s+/g, '_') ||
          exception.name.replace(/Exception$/, '').toUpperCase();
      }
    } else if (exception instanceof Error) {
      this.logger.error(
        `Unhandled Error on ${request.method} ${request.url}: ${exception.message}`,
        exception.stack,
      );
    }

    const payload: ApiResponse<null> = {
      success: false,
      statusCode,
      error: {
        code: errorCode,
        details,
      },
      timestamp: new Date().toISOString(),
    };

    response.status(statusCode).json(payload);
  }
}

