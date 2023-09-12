import { ApiGuard, CurrentUser, RoleEnum, Roles, RolesGuard, UserPayload } from '@app/auth';
import {
  CommonResponseDTO,
  RMSRequestLogInterceptor,
  RMSValidationPipe,
  SwaggerResponseType,
  TransformInterceptor,
} from '@app/common';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
  UseInterceptors,
  UsePipes,
} from '@nestjs/common';
import { ApiOkResponse, ApiQuery, ApiTags } from '@nestjs/swagger';
import { ReportService } from './report.service';
import { CreateReportListDTO } from './dtos/create-report.dto';
import { ReportResponseDTO } from './dtos/report-response.dto';
import { UpdateReportDTO } from './dtos/update-report.dto';
import { ReportEntity } from './entities/report.entity';
import { QueryReportDTO } from './dtos/query-report.dto';

@ApiTags('Report')
@Controller('reports')
@ApiGuard()
@UseGuards(RolesGuard)
@UsePipes(RMSValidationPipe)
@UseInterceptors(TransformInterceptor, RMSRequestLogInterceptor)
export class ReportController {
  constructor(private readonly reportService: ReportService) {}

  @Post()
  @Roles(RoleEnum.ADMIN)
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: () => SwaggerResponseType(ReportResponseDTO, true) })
  public async createReportList(
    @Body() body: CreateReportListDTO,
    @CurrentUser() user: UserPayload,
  ): Promise<ReportEntity[]> {
    return await this.reportService.createReportList(body.list, user);
  }

  @Get()
  @Roles(RoleEnum.ADMIN, RoleEnum.USER)
  @HttpCode(HttpStatus.OK)
  @ApiQuery({ type: QueryReportDTO })
  @ApiOkResponse({ type: () => SwaggerResponseType(ReportResponseDTO, true) })
  public async getReportList(
    @Query() query: QueryReportDTO,
  ): Promise<ReportEntity[]> {
    return await this.reportService.getReportList(
      query.fromDate,
      query.toDate,
      query.currentPage,
      query.perPage,
    );
  }

  @Get('/:id')
  @Roles(RoleEnum.ADMIN, RoleEnum.USER)
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: () => SwaggerResponseType(ReportResponseDTO) })
  public async getReport(@Param('id') id: number): Promise<ReportEntity> {
    return await this.reportService.getReport(id);
  }

  @Patch('/:id')
  @Roles(RoleEnum.ADMIN)
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: () => SwaggerResponseType(CommonResponseDTO) })
  public async updateReport(
    @Param('id') id: number,
    @Body() body: UpdateReportDTO,
    @CurrentUser() user: UserPayload,
  ) {
    return await this.reportService.updateReport(id, body, user);
  }

  @Delete('/:id')
  @Roles(RoleEnum.ADMIN)
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: () => SwaggerResponseType(CommonResponseDTO) })
  public async softDeleteReport(
    @Param('id') id: number,
    @CurrentUser() user: UserPayload,
  ): Promise<CommonResponseDTO> {
    return await this.reportService.softDeleteReport(id, user);
  }
}
