import { hashPassword } from '@app/auth';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SignUpDTO } from '../account/dtos/sign-up.dto';
import { UserEntity } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepo: Repository<UserEntity>,
  ) {}

  public async searchUserByEmail(email: string): Promise<UserEntity> {
    const user: Promise<UserEntity> = this.userRepo.findOne({
      where: { email: email },
      relations: { role: true },
    });
    return user;
  }

  public async createUser(dto: SignUpDTO): Promise<UserEntity> {
    const newUser: UserEntity = new UserEntity();
    newUser.email = dto.email;
    newUser.hashPassword = await hashPassword(dto.password);
    newUser.firstName = dto?.firstName;
    newUser.lastName = dto.lastName;
    newUser.roleId = dto.roleId;

    return this.userRepo.save(newUser);
  }

  public async getUserById(id: number): Promise<UserEntity> {
    const user: Promise<UserEntity> = this.userRepo.findOne({
      where: { id: id },
    });
    return user;
  }
}
