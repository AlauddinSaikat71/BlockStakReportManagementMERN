import { ApiResponseProperty } from '@nestjs/swagger';
import { RoleResponseDTO } from 'src/modules/role/dtos/role-response.dto';

export class UserResponseDto {
  @ApiResponseProperty()
  id: number;

  @ApiResponseProperty()
  email: string;

  @ApiResponseProperty()
  firstName: string;

  @ApiResponseProperty()
  lastName: string;

  @ApiResponseProperty()
  roleId: number;

  @ApiResponseProperty({ type: RoleResponseDTO })
  role: RoleResponseDTO;
}
