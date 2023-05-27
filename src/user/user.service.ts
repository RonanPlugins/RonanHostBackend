import { ConflictException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async checkIfEntityExists(column: keyof User, value: any) {
    if (await this.userRepository.findOne({ where: { [column]: value } }))
      throw new ConflictException(`${column} already exists`);
  }
  async create(createUserDto: CreateUserDto) {
    const { password } = createUserDto;
    await this.checkIfEntityExists('username', createUserDto.username);
    await this.checkIfEntityExists('email', createUserDto.email);

    createUserDto.password = await bcrypt.hash(password, 10);
    const user = this.userRepository.create(createUserDto);
    user.avatar =
      'https://s.gravatar.com/avatar/' +
      crypto
        .createHash('md5')
        .update(createUserDto.email.trim().toLowerCase())
        .digest('hex') +
      '?d=mp';
    return await this.userRepository.save(user);
  }

  async findAll(): Promise<User[]> {
    return await this.userRepository.find();
  }

  async findOne(id: number): Promise<User> {
    return await this.userRepository.findOne({ where: { id } });
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    await this.userRepository.update(id, updateUserDto);
    return this.userRepository.findOne({ where: { id } });
  }

  async remove(id: number) {
    return await this.userRepository.delete(id);
  }

  async generateResetToken(email: string): Promise<string> {
    const user = await this.userRepository.findOne({ where: { email } });

    if (!user) throw new Error('Invalid email');

    const resetToken = crypto.randomBytes(32).toString('hex');
    user.passwordResetToken = resetToken;

    await this.userRepository.save(user);

    return resetToken;
  }

  async resetPassword(token: string, newPassword: string): Promise<void> {
    const user = await this.userRepository.findOne({
      where: { passwordResetToken: token },
    });

    if (!user) throw new Error('Invalid token');

    user.password = await bcrypt.hash(newPassword, 10);

    user.passwordResetToken = null;

    await this.userRepository.save(user);
  }
  async updateUser(id: number, data: Partial<User>): Promise<User> {
    await this.userRepository.update(id, data);
    return await this.findOne(id);
  }
}
