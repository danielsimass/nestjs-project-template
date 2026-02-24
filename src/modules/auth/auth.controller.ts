import { Controller, Post, Body, HttpCode, HttpStatus, Res, Get, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import type { Response, Request } from 'express';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { AuthResponseDto } from './dto/auth-response.dto';
import { SetFirstPasswordDto } from './dto/set-first-password.dto';
import { Public } from './decorators/public.decorator';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login' })
  @ApiResponse({ status: 200, description: 'Login successful', type: AuthResponseDto })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) response: Response
  ): Promise<AuthResponseDto> {
    const { accessToken, user } = await this.authService.login(loginDto);
    response.cookie('access_token', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 1000,
    });
    return user;
  }

  @Post('logout')
  @ApiBearerAuth()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Logout' })
  @ApiResponse({ status: 204, description: 'Logout successful' })
  logout(@Res({ passthrough: true }) response: Response): void {
    response.clearCookie('access_token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });
  }

  @Get('me')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get authenticated user information' })
  @ApiResponse({ status: 200, description: 'User information', type: AuthResponseDto })
  @ApiResponse({ status: 401, description: 'Not authenticated' })
  getMe(@Req() request: Request): Record<string, unknown> {
    return request.user as Record<string, unknown>;
  }

  @Post('refresh')
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Refresh access token' })
  @ApiResponse({ status: 200, description: 'Token refreshed successfully' })
  @ApiResponse({ status: 401, description: 'Not authenticated' })
  async refresh(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response
  ): Promise<{ message: string }> {
    const user = request.user as { userId: string };
    const { accessToken } = await this.authService.refreshToken(user.userId);
    response.cookie('access_token', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 1000, // 1 hour
    });
    return { message: 'Token refreshed successfully' };
  }

  @Public()
  @Post('check-first-login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Check if user needs to set password on first access' })
  @ApiResponse({
    status: 200,
    description: 'First login status checked',
    schema: {
      type: 'object',
      properties: {
        requiresPasswordSetup: { type: 'boolean', example: true },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'User not found or inactive' })
  async checkFirstLogin(@Body() body: { username: string }): Promise<{
    requiresPasswordSetup: boolean;
  }> {
    return this.authService.checkFirstLogin(body.username);
  }

  @Public()
  @Post('set-first-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Set password on first access and automatically login' })
  @ApiResponse({
    status: 200,
    description: 'Password set and login successful',
    type: AuthResponseDto,
  })
  @ApiResponse({ status: 401, description: 'User not found, inactive or already has password' })
  async setFirstPassword(
    @Body() setFirstPasswordDto: SetFirstPasswordDto,
    @Res({ passthrough: true }) response: Response
  ): Promise<AuthResponseDto> {
    const { accessToken, user } = await this.authService.setFirstPassword(
      setFirstPasswordDto.username,
      setFirstPasswordDto.password,
      setFirstPasswordDto.secureCode
    );
    response.cookie('access_token', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 1000,
    });
    return user;
  }
}
