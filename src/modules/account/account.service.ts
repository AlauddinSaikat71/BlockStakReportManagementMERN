import { AuthService } from './../../../libs/auth/src/auth.service';
import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
  forwardRef,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { UserEntity } from '../user/entities/user.entity';
import { UserService } from '../user/user.service';
import { LogInDTO } from './dtos/log-in.dto';
import { LogInResponseDTO } from './dtos/login-response.dto';
import { SignUpDTO } from './dtos/sign-up.dto';
import { SignUpResponseDTO } from './dtos/signup-response.dto';
import { TokenTypeEnum } from '@app/auth/enums/TokenTypeEnum';
import { InjectRepository } from '@nestjs/typeorm';
import RefreshTokenEntity from './entity/refresh-token.entity';
import { Repository } from 'typeorm';
import { CommonResponseDTO } from '@app/common';

@Injectable()
export class AccountService {
  constructor(
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly authService: AuthService,
    @InjectRepository(RefreshTokenEntity)
    private readonly refreshTokenRepository: Repository<RefreshTokenEntity>,
  ) {}

  public async signUp(dto: SignUpDTO) {
    const existingUser = await this.userService.searchUserByEmail(dto.email);
    if (existingUser)
      throw new BadRequestException(
        `Already an user exists by this email: ${dto.email}`,
      );

    const newUser: UserEntity = await this.userService.createUser(dto);
    delete newUser.hashPassword;
    const jwtPayload = {
      id: newUser.id,
      email: newUser.email,
      firstName: newUser.firstName,
      lastName: newUser.lastName,
      roleId: newUser.roleId,
      role: newUser.role,
    };
    const accessToken = await this.jwtService.signAsync(
      jwtPayload,
      this.authService.getJwtSignedOptions(TokenTypeEnum.AccessToken),
    );

    const refreshToken = await this.jwtService.signAsync(
      jwtPayload,
      this.authService.getJwtSignedOptions(TokenTypeEnum.RefreshToken),
    );

    const signupResponse: SignUpResponseDTO = new SignUpResponseDTO(
      true,
      'Sign-up Successfull',
    );
    signupResponse.accessToken = accessToken;
    signupResponse.refreshToken = refreshToken;

    return signupResponse;
  }

  public async logIn(dto: LogInDTO): Promise<LogInResponseDTO> {
    const user: UserEntity = await this.validateUser(dto);

    delete user.hashPassword;
    const jwtPayload = {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      roleId: user.roleId,
      role: user.role,
    };
    const accessToken = await this.jwtService.signAsync(
      jwtPayload,
      this.authService.getJwtSignedOptions(TokenTypeEnum.AccessToken),
    );

    const refreshToken = await this.jwtService.signAsync(
      jwtPayload,
      this.authService.getJwtSignedOptions(TokenTypeEnum.RefreshToken),
    );

    const loginResponse: LogInResponseDTO = new LogInResponseDTO(
      true,
      'Log-in Successfull',
    );
    loginResponse.accessToken = accessToken;
    loginResponse.refreshToken = refreshToken;

    return loginResponse;
  }

  private async validateUser(dto: LogInDTO): Promise<UserEntity> {
    const user: UserEntity = await this.userService.searchUserByEmail(
      dto.email,
    );
    if (!user) {
      throw new NotFoundException(`No user found by this email: ${dto.email}`);
    }

    const isPasswordValid = await bcrypt.compare(
      dto.password,
      user.hashPassword,
    );
    if (!isPasswordValid)
      throw new UnauthorizedException('Incorrect password. Please try again');
    return user;
  }

  async refreshAccessToken(refreshToken: string): Promise<LogInResponseDTO> {
    try {
      const payload = this.jwtService.verify(refreshToken, {
        ignoreExpiration: false, // Ensure the expiration is checked
      });

      if (!payload || !payload.sub) {
        throw new NotFoundException('Invalid refresh token');
      }

      // Check if the refresh token exists in the database
      const refreshTokenEntity = await this.refreshTokenRepository.findOne({
        where: {
          userId: payload.id,
          refreshToken: refreshToken,
        },
      });

      if (!refreshTokenEntity) {
        throw new NotFoundException('Refresh token not found in the database');
      }

      // Generate a new access token
      const user = await this.userService.getUserById(payload.id);
      if (!user) {
        throw new NotFoundException('User not found');
      }

      // Delete the used refresh token from the database
      await this.refreshTokenRepository.delete(refreshTokenEntity.id);

      delete user.hashPassword;
      const jwtPayload = {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        roleId: user.roleId,
        role: user.role,
      };
      const newAccessToken = await this.jwtService.signAsync(
        jwtPayload,
        this.authService.getJwtSignedOptions(TokenTypeEnum.AccessToken),
      );

      const newRefreshToken = await this.jwtService.signAsync(
        jwtPayload,
        this.authService.getJwtSignedOptions(TokenTypeEnum.RefreshToken),
      );

      const loginResponse: LogInResponseDTO = new LogInResponseDTO(
        true,
        'Log-in Successfull',
      );
      loginResponse.accessToken = newAccessToken;
      loginResponse.refreshToken = newRefreshToken;

      return loginResponse;
    } catch (error) {
      // Handle errors when refreshing the token (e.g., invalid refresh token, expired token)
      throw new UnauthorizedException('Unable to refresh token');
    }
  }

  async logout(refreshToken: string): Promise<CommonResponseDTO> {
    await this.deleteToken(refreshToken);

    const deleteResponse = new CommonResponseDTO(true, 'Log out Successful');
    return deleteResponse;
  }

  public async deleteToken(refreshToken: string) {
    const token = await this.refreshTokenRepository.findOne({
      where: { refreshToken: refreshToken },
    });

    await this.refreshTokenRepository.delete(token.id);
  }
}
