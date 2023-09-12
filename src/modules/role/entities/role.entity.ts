import { BaseEntity } from '@app/common';
import { UserEntity } from 'src/modules/user/entities/user.entity';
import { Column, Entity, JoinTable, OneToMany } from 'typeorm';

@Entity({ name: 'roles' })
export class RoleEntity extends BaseEntity {
  @Column({ type: 'text' })
  role: string;

  @OneToMany(() => UserEntity, (user: UserEntity) => user.role)
  @JoinTable()
  users: UserEntity[];
}
