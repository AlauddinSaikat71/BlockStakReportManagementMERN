import { RoleEnum, Roles, RolesGuard } from '@app/auth';
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
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Param,
  Post,
  UseGuards,
  UseInterceptors,
  UsePipes,
} from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { AccountService } from './account.service';
import { LogInDTO } from './dtos/log-in.dto';
import { LogInResponseDTO } from './dtos/login-response.dto';
import { SignUpDTO } from './dtos/sign-up.dto';
import { SignUpResponseDTO } from './dtos/signup-response.dto';

@ApiTags('account')
@Controller('account')
@UseGuards(RolesGuard)
@UsePipes(RMSValidationPipe)
@UseInterceptors(TransformInterceptor, RMSRequestLogInterceptor)
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @Post('sign-up')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: () => SwaggerResponseType(SignUpResponseDTO) })
  public async signUp(@Body() body: SignUpDTO): Promise<SignUpResponseDTO> {
    return await this.accountService.signUp(body);
  }

  @Post('log-in')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: () => SwaggerResponseType(LogInResponseDTO) })
  public async logIn(@Body() body: LogInDTO): Promise<LogInResponseDTO> {
    return await this.accountService.logIn(body);
  }

  @Post('refresh-token')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: () => SwaggerResponseType(LogInResponseDTO) })
  public async refreshToken(
    @Param('refreshToken') refreshToken: string,
  ): Promise<LogInResponseDTO> {
    try {
      const logInResponse = await this.accountService.refreshAccessToken(
        refreshToken,
      );
      return logInResponse;
    } catch (error) {
      throw new HttpException(
        'Unable to refresh token',
        HttpStatus.UNAUTHORIZED,
      );
    }
  }

  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: () => SwaggerResponseType(Boolean) })
  @Post('logout')
  @Roles(RoleEnum.ADMIN, RoleEnum.USER)
  async logout(
    @Param('refreshToken') refreshToken: string,
  ): Promise<CommonResponseDTO> {
    const deleteResponse = await this.accountService.logout(refreshToken);

    return deleteResponse;
  }
}
