import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, ValidateNested } from 'class-validator';

export class CreateReportDTO {
  @ApiProperty()
  name: string;

  @ApiProperty()
  address: string;

  @ApiProperty()
  phone: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  profession: string;

  @ApiProperty()
  favoriteColors: string;
}

export class CreateReportListDTO {
  @ApiProperty({ type: CreateReportDTO, isArray: true })
  @Type(() => CreateReportDTO)
  @IsArray()
  @ValidateNested()
  list: CreateReportDTO[];
}
