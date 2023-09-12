import { Roles, UserPayload } from '@app/auth';
import { CommonResponseDTO, ORDER } from '@app/common';
import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { from, mergeMap, toArray } from 'rxjs';
import { Between, Repository } from 'typeorm';
import { CreateReportDTO } from './dtos/create-report.dto';
import { UpdateReportDTO } from './dtos/update-report.dto';
import { ReportEntity } from './entities/report.entity';

@Injectable()
export class ReportService {
  constructor(
    @InjectRepository(ReportEntity)
    private readonly reportRepo: Repository<ReportEntity>,
  ) {}

  public async createReport(
    dto: CreateReportDTO,
    user: UserPayload,
  ): Promise<ReportEntity> {
    const report: ReportEntity = await this.reportRepo.create({ ...dto });
    report.createdBy = user.id;
    return this.reportRepo.save(report);
  }

  public async createReportList(list: CreateReportDTO[], user: UserPayload) {
    return from(list)
      .pipe(
        mergeMap((dto) => this.createReport(dto, user)),
        toArray(),
      )
      .toPromise();
  }

  private async findOneByID(id: number): Promise<ReportEntity> {
    const report: ReportEntity = await this.reportRepo.findOneBy({
      id: id,
    });

    if (!report)
      throw new NotFoundException(`Report not found by this id = ${id}`);
    return report;
  }

  public async getReport(id: number): Promise<ReportEntity> {
    const report: ReportEntity = await this.findOneByID(id);

    return report;
  }

  public async updateReport(
    id: number,
    dto: UpdateReportDTO,
    user: UserPayload,
  ): Promise<CommonResponseDTO> {
    const report: ReportEntity = await this.findOneByID(id);

    await this.reportRepo.update(
      { id: id },
      { ...dto, lastUpdatedBy: user.id },
    );

    const response: CommonResponseDTO = new CommonResponseDTO(
      true,
      `Updated Successgully`,
    );
    return response;
  }

  public async softDeleteReport(id: number, user: UserPayload) {
    const report: ReportEntity = await this.findOneByID(id);

    await this.reportRepo.update(
      { id: id },
      { lastUpdatedBy: user.id, isActive: false },
    );

    const response: CommonResponseDTO = new CommonResponseDTO(
      true,
      `Deleted Successgully`,
    );
    return response;
  }

  public async getReportList(
    fromDate: Date,
    toDate: Date,
    currentPage: number,
    perPage: number,
  ): Promise<ReportEntity[]> {
    return await this.reportRepo.find({
      where: {
        createdAt: Between(fromDate, toDate),
        isActive: true,
      },
      skip: (currentPage - 1) * perPage,
      take: perPage,
      order: {
        createdAt: ORDER.ASC,
      },
    });
  }
}
