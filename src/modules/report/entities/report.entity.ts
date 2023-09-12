import { BaseEntity } from '@app/common';
import { Column, Entity } from 'typeorm';

@Entity({ name: 'reports' })
export class ReportEntity extends BaseEntity {
  @Column()
  name: string;

  @Column()
  address: string;

  @Column()
  phone: string;

  @Column()
  email: string;

  @Column()
  profession: string;

  @Column()
  favoriteColors: string;
}
