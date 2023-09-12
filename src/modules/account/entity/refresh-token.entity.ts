import { Column, Entity } from 'typeorm';
import { BaseEntity } from '@app/common';

@Entity({ name: 'refresh_tokens' })
class RefreshTokenEntity extends BaseEntity {
  constructor() {
    super();
  }

  @Column()
  public userId: number;

  @Column({ name: 'refresh_token', type: String, default: null })
  public refreshToken: string;
}

export default RefreshTokenEntity;
