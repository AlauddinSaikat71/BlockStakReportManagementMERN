import {
  BadRequestException,
  Injectable,
  Optional,
  ValidationPipe,
  ValidationPipeOptions,
} from '@nestjs/common';
import { ValidationError } from 'class-validator';

@Injectable()
export class RMSValidationPipe extends ValidationPipe {
  constructor(@Optional() options?: ValidationPipeOptions) {
    options = options || {};
    super({
      transform: true,
      whitelist: false,
      transformOptions: {
        exposeDefaultValues: true,
      },
      ...options,
      //exceptionFactory: (errors) => this.buildError(errors),
    });
  }

  private buildError(errors: ValidationError[]) {
    const properties = errors.map((x) => x.property).toString();
    const constraints = errors.map((x) => x.constraints).toString();
    const message = `Required properties ${properties} missing or invalid 
                      Constraints: ${constraints}`;
    return new BadRequestException(message);
  }
}
