import { ApiResponseProperty } from '@nestjs/swagger';

export class CommonResponseDTO {
  constructor(isSuccess: boolean, message: string) {
    this.isSuccess = isSuccess;
    this.message = message;
  }
  @ApiResponseProperty()
  isSuccess: boolean;

  @ApiResponseProperty()
  message: string;
}
