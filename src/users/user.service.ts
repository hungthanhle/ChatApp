import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from './repos/user.repository';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { hashPassword } from '../utils/helpers';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
  ) {}

  async findAll(): Promise<User[]> {
    return await this.userRepository.find();
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const user = new User();
    user.name = createUserDto.name;
    user.email = createUserDto.email;
    user.password = await hashPassword(createUserDto.password);
    user.phone = createUserDto.phone;
    user.createdAt = new Date();
    user.updatedAt = user.createdAt;
    return await this.userRepository.save(user);
  }

  async findById(id: number): Promise<User | null> {
    return await this.userRepository.findOne({ id });
  }

  async findByUsername(name: string): Promise<User | null> {
    return await this.userRepository.findOne({ name });
  }

  async findByEmail(email: string): Promise<User | null> {
    return await this.userRepository.findOne({ email });
  }

  async update(user: User, createUserDto: CreateUserDto) {
    createUserDto.updatedAt = new Date();
    return await this.userRepository.update(user, createUserDto);
  }

  async deleteById(id: number): Promise<void> {
    await this.userRepository.delete({ id });
  }

  async findByPhone(phone: string): Promise<User | null> {
    return await this.userRepository.findOne({ phone });
  }
}
