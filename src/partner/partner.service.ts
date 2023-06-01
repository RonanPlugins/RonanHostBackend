import { Injectable } from '@nestjs/common';
import { CreatePartnerDto } from './dto/create-partner.dto';
import { UpdatePartnerDto } from './dto/update-partner.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { PartnerEntity } from './entities/partner.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PartnerService {
  constructor(
    @InjectRepository(PartnerEntity) private partnerRepository: Repository<PartnerEntity>,
  ) {}

  create(createPartnerDto: CreatePartnerDto): Promise<PartnerEntity> {
    const partner = this.partnerRepository.create(createPartnerDto);
    return this.partnerRepository.save(partner);
  }

  async findAll(): Promise<PartnerEntity[]> {
    return this.partnerRepository.find();
  }

  async findOne(id: number): Promise<PartnerEntity> {
    return this.partnerRepository.findOne({ where: { id } });
  }

  async update(
    id: number,
    updatePartnerDto: UpdatePartnerDto,
  ): Promise<PartnerEntity> {
    await this.partnerRepository.update(id, updatePartnerDto);
    return this.partnerRepository.findOne({ where: { id } });
  }

  async remove(id: number): Promise<void> {
    await this.partnerRepository.delete(id);
  }
}
