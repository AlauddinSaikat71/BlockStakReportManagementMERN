import { PartialType } from '@nestjs/swagger';
import { CreateReportDTO } from './create-report.dto';

export class UpdateReportDTO extends PartialType(CreateReportDTO) {}
