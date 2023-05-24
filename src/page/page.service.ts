import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PageEntity } from './page.entity';
import { FindManyOptions, Repository } from 'typeorm';
import { UserDto } from '../user/user.dto';
import { UserEntity } from '../user/user.entity';
import { PageDto } from './page.dto';

@Injectable()
export class PageService {
  constructor(
    @InjectRepository(PageEntity)
    private pageEntityRepository: Repository<PageEntity>,
  ) {}

  async checkIfEntityExists(column: keyof PageEntity, value: any) {
    if (
      await this.pageEntityRepository.findOne({ where: { [column]: value } })
    ) {
      throw new ConflictException(`${column} already exists`);
    }
  }

  findAll(options: FindManyOptions = undefined): Promise<PageEntity[]> {
    return this.pageEntityRepository.find(options);
  }

  findOne(id: number): Promise<PageEntity> {
    return this.pageEntityRepository.findOne({ where: { id } });
  }

  findOneByName(name: string): Promise<PageEntity> {
    return this.pageEntityRepository.findOne({ where: { name: name } });
  }

  async createPage(pageDto: PageDto): Promise<PageEntity> {
    const { name, content, title } = pageDto;
    await this.checkIfEntityExists('name', name);

    const page = new PageEntity();
    page.name = name;
    page.content = content;
    page.title = title;

    return await this.pageEntityRepository.save(page);
  }

  async updateServer(
    id: number,
    data: Partial<PageEntity>,
  ): Promise<PageEntity> {
    await this.pageEntityRepository.update(id, data);
    return await this.findOne(id);
  }
}
