import { applyDecorators, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

export function ApiGuard() {
  return applyDecorators(UseGuards(AuthGuard(['basic', 'jwt'])));
}
