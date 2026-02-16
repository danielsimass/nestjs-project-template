import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import { AuthResponseDto } from './dto/auth-response.dto';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { User } from '../users/entities/user.entity';
import { SecureCodeUtil } from '../common/utils';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService
  ) {}

  async validateUser(loginDto: LoginDto): Promise<User> {
    let user = await this.usersService.findByEmail(loginDto.username);
    if (!user) {
      user = await this.usersService.findByUsername(loginDto.username);
    }
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    if (!user.isActive) {
      throw new UnauthorizedException('User inactive');
    }

    // If user doesn't have a password, they can't login normally
    if (!user.password) {
      throw new UnauthorizedException('User needs to set password on first access');
    }

    const isPasswordValid = await bcrypt.compare(loginDto.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return user;
  }

  async login(loginDto: LoginDto): Promise<{ accessToken: string; user: AuthResponseDto }> {
    const user = await this.validateUser(loginDto);

    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      username: user.username,
      role: user.role,
    };

    const accessToken = this.jwtService.sign(payload);

    const authResponse: AuthResponseDto = {
      userId: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      isFirstLogin: user.isFirstLogin,
      requiresPasswordSetup: !user.password,
    };

    return {
      accessToken,
      user: authResponse,
    };
  }

  async validateToken(token: string): Promise<JwtPayload> {
    try {
      return this.jwtService.verify<JwtPayload>(token);
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }

  async refreshToken(userId: string): Promise<{ accessToken: string }> {
    const user = await this.usersService.findOne(userId);

    if (!user || !user.isActive) {
      throw new UnauthorizedException('User inactive or not found');
    }

    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      username: user.username,
      role: user.role,
    };

    const accessToken = this.jwtService.sign(payload);

    return { accessToken };
  }

  async checkFirstLogin(username: string): Promise<{ requiresPasswordSetup: boolean }> {
    let user = await this.usersService.findByEmail(username);
    if (!user) {
      user = await this.usersService.findByUsername(username);
    }
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    if (!user.isActive) {
      throw new UnauthorizedException('User inactive');
    }

    return {
      requiresPasswordSetup: !user.password,
    };
  }

  async setFirstPassword(
    username: string,
    password: string,
    secureCode: string
  ): Promise<{ accessToken: string; user: AuthResponseDto }> {
    let user = await this.usersService.findByEmail(username);
    if (!user) {
      user = await this.usersService.findByUsername(username);
    }
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    if (!user.isActive) {
      throw new UnauthorizedException('User inactive');
    }
    if (user.password) {
      throw new UnauthorizedException(
        'User already has a password. Use the normal login flow.'
      );
    }

    // Check if user has a secure code
    if (!user.secureCode) {
      throw new UnauthorizedException(
        'Verification code was not generated. Request a new invite.'
      );
    }

    // Validate secure code
    const isCodeValid = await SecureCodeUtil.verifyCode(secureCode, user.secureCode);
    if (!isCodeValid) {
      throw new UnauthorizedException('Invalid verification code');
    }

    // Set new password and clear secure code
    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    user.isFirstLogin = false;
    user.secureCode = undefined; // Remove code after use
    await this.usersService.updateUserPassword(user);

    // Generate token and return
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      username: user.username,
      role: user.role,
    };

    const accessToken = this.jwtService.sign(payload);

    const authResponse: AuthResponseDto = {
      userId: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      isFirstLogin: false,
      requiresPasswordSetup: false,
    };

    return {
      accessToken,
      user: authResponse,
    };
  }
}
