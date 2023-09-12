import { PickType } from '@nestjs/swagger';
import { SignUpDTO } from './sign-up.dto';

export class LogInDTO extends PickType(SignUpDTO, ['email', 'password']) {}
