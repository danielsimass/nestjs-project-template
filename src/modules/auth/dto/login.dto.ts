import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ example: 'johndoe', description: 'Username or email' })
  @IsNotEmpty({ message: 'Username or email is required' })
  @IsString({ message: 'Username or email must be a string' })
  username: string;

  @ApiProperty({ example: 'SecurePassword123!', description: 'User password' })
  @IsNotEmpty({ message: 'Password is required' })
  @IsString({ message: 'Password must be a string' })
  password: string;
}
