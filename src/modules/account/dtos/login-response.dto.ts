import { ApiResponseProperty } from '@nestjs/swagger';
import { UserResponseDto } from 'src/modules/user/dtos/user-response.dto';

export class LogInResponseDTO {
  constructor(isSuccess: boolean, message: string) {
    this.isSuccess = isSuccess;
    this.message = message;
  }
  @ApiResponseProperty({})
  isSuccess: boolean;

  @ApiResponseProperty()
  message: string;

  @ApiResponseProperty()
  accessToken: string;

  @ApiResponseProperty()
  refreshToken: string;
}
