import { Injectable } from '@nestjs/common';
import { CreatePartnershipRequestDto } from './dto/create-partnership-request.dto';
import { UpdatePartnershipRequestDto } from './dto/update-partnership-request.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { PartnershipRequestEntity } from './entities/partnership-request.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PartnershipRequestService {
  constructor(
    @InjectRepository(PartnershipRequestEntity)
    private partnershipRequestEntityRepository: Repository<PartnershipRequestEntity>,
  ) {}
  async create(
    createPartnershipRequestDto: CreatePartnershipRequestDto,
  ): Promise<PartnershipRequestEntity> {
    const partnershipRequest = this.partnershipRequestEntityRepository.create(
      createPartnershipRequestDto,
    );
    return this.partnershipRequestEntityRepository.save(partnershipRequest);
  }

  async findAll(): Promise<PartnershipRequestEntity[]> {
    return this.partnershipRequestEntityRepository.find();
  }

  async findOne(id: number): Promise<PartnershipRequestEntity> {
    return this.partnershipRequestEntityRepository.findOne({ where: { id } });
  }

  async update(
    id: number,
    updatePartnershipRequestDto: UpdatePartnershipRequestDto,
  ): Promise<PartnershipRequestEntity> {
    await this.partnershipRequestEntityRepository.update(
      id,
      updatePartnershipRequestDto,
    );
    return this.partnershipRequestEntityRepository.findOne({ where: { id } });
  }

  async remove(id: number): Promise<void> {
    await this.partnershipRequestEntityRepository.delete(id);
  }
}
