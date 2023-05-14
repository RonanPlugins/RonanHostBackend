import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from './user.entity/user.entity';
import * as bcrypt from 'bcrypt';
import { UserDto } from './user.dto';

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
}
