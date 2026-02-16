import { IsNotEmpty, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ChangePasswordDto {
  @ApiProperty({ example: 'OldPassword123!', description: 'Current user password' })
  @IsNotEmpty({ message: 'Current password is required' })
  @IsString({ message: 'Current password must be a string' })
  currentPassword: string;

  @ApiProperty({ example: 'NewPassword123!', description: 'New user password' })
  @IsNotEmpty({ message: 'New password is required' })
  @IsString({ message: 'New password must be a string' })
  @MinLength(6, { message: 'New password must be at least 6 characters' })
  newPassword: string;
}
