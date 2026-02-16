import {
  Injectable,
  ConflictException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { UsersRepository } from './repositories';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const existingUserByEmail = await this.usersRepository.findByEmail(
      createUserDto.email
    );

    if (existingUserByEmail) {
      throw new ConflictException('Email already registered');
    }

    const existingUserByUsername = await this.usersRepository.findByUsername(
      createUserDto.username
    );

    if (existingUserByUsername) {
      throw new ConflictException('Username already registered');
    }

    const hashedPassword = createUserDto.password
      ? await bcrypt.hash(createUserDto.password, 10)
      : undefined;

    const user = this.usersRepository.create({
      name: createUserDto.name,
      email: createUserDto.email,
      username: createUserDto.username,
      password: hashedPassword,
      role: createUserDto.role,
    });

    return this.usersRepository.save(user);
  }

  async findAll(): Promise<User[]> {
    return this.usersRepository.findAll();
  }

  async findOne(id: string): Promise<User> {
    const user = await this.usersRepository.findById(id);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findByEmail(email);
  }

  async findByUsername(username: string): Promise<User | null> {
    return this.usersRepository.findByUsername(username);
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id);

    if (updateUserDto.email && updateUserDto.email !== user.email) {
      const existingUser = await this.usersRepository.findByEmail(
        updateUserDto.email
      );

      if (existingUser) {
        throw new ConflictException('Email already registered');
      }
    }

    if (updateUserDto.username && updateUserDto.username !== user.username) {
      const existingUser = await this.usersRepository.findByUsername(
        updateUserDto.username
      );

      if (existingUser) {
        throw new ConflictException('Username already registered');
      }
    }

    Object.assign(user, updateUserDto);
    return this.usersRepository.save(user);
  }

  async changePassword(
    userId: string,
    changePasswordDto: ChangePasswordDto
  ): Promise<void> {
    const user = await this.findOne(userId);

    if (user.password) {
      const isPasswordValid = await bcrypt.compare(
        changePasswordDto.currentPassword,
        user.password
      );

      if (!isPasswordValid) {
        throw new UnauthorizedException('Current password is incorrect');
      }
    }

    const hashedPassword = await bcrypt.hash(changePasswordDto.newPassword, 10);

    user.password = hashedPassword;
    user.isFirstLogin = false;
    await this.usersRepository.save(user);
  }

  async updateUserPassword(user: User): Promise<User> {
    return this.usersRepository.save(user);
  }

  async deactivate(id: string): Promise<User> {
    const user = await this.findOne(id);
    user.isActive = false;
    return this.usersRepository.save(user);
  }

  async activate(id: string): Promise<User> {
    const user = await this.findOne(id);
    user.isActive = true;
    return this.usersRepository.save(user);
  }

  async remove(id: string): Promise<void> {
    const user = await this.findOne(id);
    await this.usersRepository.remove(user);
  }
}
