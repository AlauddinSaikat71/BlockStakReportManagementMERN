import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsDate, IsNumber, isNumber } from 'class-validator';

export class QueryReportDTO {
  @IsDate()
  @Type(() => Date)
  @ApiProperty()
  fromDate: Date;

  @IsDate()
  @Type(() => Date)
  @ApiProperty()
  toDate: Date;

  @ApiProperty()
  @IsNumber()
  @Transform((x: any) => {
    return isNumber(x.value) ? x.value : Number(x.value);
  })
  currentPage: number;

  @ApiProperty()
  @IsNumber()
  @Transform((x: any) => {
    return isNumber(x.value) ? x.value : Number(x.value);
  })
  perPage: number;
}
