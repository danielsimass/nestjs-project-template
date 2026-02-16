import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { IUsersRepository } from './users.repository.interface';
import { UserCreateData } from './types';

@Injectable()
export class UsersRepository implements IUsersRepository {
  constructor(
    @InjectRepository(User)
    private readonly repository: Repository<User>
  ) {}

  create(data: UserCreateData): User {
    return this.repository.create(data);
  }

  async save(user: User): Promise<User> {
    return await this.repository.save(user);
  }

  async findById(id: string): Promise<User | null> {
    return this.repository.findOne({
      where: { id },
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.repository.findOne({
      where: { email },
    });
  }

  async findByUsername(username: string): Promise<User | null> {
    return this.repository.findOne({
      where: { username },
    });
  }

  async findAll(): Promise<User[]> {
    return this.repository.find({
      order: { createdAt: 'DESC' },
    });
  }

  async remove(user: User): Promise<void> {
    await this.repository.remove(user);
  }
}
