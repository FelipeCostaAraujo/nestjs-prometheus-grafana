import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class FindUserDTO {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  email: string;
}
