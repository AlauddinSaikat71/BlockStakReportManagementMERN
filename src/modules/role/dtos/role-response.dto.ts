import { ApiResponseProperty } from '@nestjs/swagger';

export class RoleResponseDTO {
  @ApiResponseProperty()
  id: number;

  @ApiResponseProperty()
  role: string;
}
