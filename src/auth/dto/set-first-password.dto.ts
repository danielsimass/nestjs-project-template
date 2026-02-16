import { IsNotEmpty, IsString, MinLength, Length, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SetFirstPasswordDto {
  @ApiProperty({ example: 'johndoe', description: 'Username or email' })
  @IsNotEmpty({ message: 'Username or email is required' })
  @IsString({ message: 'Username or email must be a string' })
  username: string;

  @ApiProperty({ example: 'NewSecurePassword123!', description: 'New user password' })
  @IsNotEmpty({ message: 'Password is required' })
  @IsString({ message: 'Password must be a string' })
  @MinLength(6, { message: 'Password must be at least 6 characters' })
  password: string;

  @ApiProperty({
    example: '123456',
    description: 'Verification code sent by email',
    minLength: 6,
    maxLength: 6,
  })
  @IsNotEmpty({ message: 'Verification code is required' })
  @IsString({ message: 'Verification code must be a string' })
  @Length(6, 6, { message: 'Code must be exactly 6 digits' })
  @Matches(/^\d{6}$/, { message: 'Code must contain only numbers' })
  secureCode: string;
}
