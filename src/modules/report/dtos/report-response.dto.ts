import { ApiResponseProperty } from '@nestjs/swagger';

export class ReportResponseDTO {
  @ApiResponseProperty()
  id: number;

  @ApiResponseProperty()
  name: string;

  @ApiResponseProperty()
  address: string;

  @ApiResponseProperty()
  phone: string;

  @ApiResponseProperty()
  email: string;

  @ApiResponseProperty()
  profession: string;

  @ApiResponseProperty()
  favoriteColors: string[];

  @ApiResponseProperty()
  createdBy: number;

  @ApiResponseProperty()
  lastUpdatedBy: string;

  @ApiResponseProperty()
  createdAt: string;

  @ApiResponseProperty()
  updatedAt: string;

  @ApiResponseProperty()
  isActive: boolean;
}
