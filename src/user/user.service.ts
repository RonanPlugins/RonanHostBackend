import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, FindOneOptions, Repository } from 'typeorm';
import { UserEntity } from './user.entity/user.entity';
import * as bcrypt from 'bcrypt';
import { UserDto } from './user.dto';
import * as crypto from 'crypto';
import { PageEntity } from '../page/page.entity/page.entity';
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private userEntityRepository: Repository<UserEntity>,
  ) {}

  async checkIfEntityExists(column: keyof UserEntity, value: any) {
    if (
      await this.userEntityRepository.findOne({ where: { [column]: value } })
    ) {
      throw new ConflictException(`${column} already exists`);
    }
  }

  async createUser(userDto: UserDto): Promise<UserEntity> {
    const { username, email, password } = userDto;
    await this.checkIfEntityExists('username', username);
    await this.checkIfEntityExists('email', email);

    const passwordHash = await bcrypt.hash(password, 10);
    const host = new UserEntity();
    host.avatar =
      'https://s.gravatar.com/avatar/' +
      crypto
        .createHash('md5')
        .update(email.trim().toLowerCase())
        .digest('hex') +
      '?d=mp';
    host.username = username;
    host.password = passwordHash;
    host.email = email;
    return await this.userEntityRepository.save(host);
  }
  async findOneByUsername(username: string): Promise<UserEntity> {
    return await this.userEntityRepository.findOne({ where: { username } });
  }
  async findOneById(id: number): Promise<UserEntity> {
    return await this.userEntityRepository.findOne({ where: { id } });
  }
  async deleteUser(id: number): Promise<DeleteResult> {
    return await this.userEntityRepository.delete(id);
  }
  async findOne(findOneOptions: FindOneOptions): Promise<UserEntity> {
    return await this.userEntityRepository.findOne(findOneOptions);
  }
  async generateResetToken(email: string): Promise<string> {
    const user = await this.userEntityRepository.findOne({ where: { email } });

    if (!user) throw new Error('Invalid email');

    const resetToken = crypto.randomBytes(32).toString('hex');
    user.passwordResetToken = resetToken;

    await this.userEntityRepository.save(user);

    return resetToken;
  }

  async resetPassword(token: string, newPassword: string): Promise<void> {
    const user = await this.userEntityRepository.findOne({
      where: { passwordResetToken: token },
    });

    if (!user) throw new Error('Invalid token');

    user.password = await bcrypt.hash(newPassword, 10);

    user.passwordResetToken = null;

    await this.userEntityRepository.save(user);
  }
  async updateUser(id: number, data: Partial<UserEntity>): Promise<UserEntity> {
    await this.userEntityRepository.update(id, data);
    return await this.findOne({ where: { id } });
  }
}
