import { Injectable } from '@nestjs/common';
import { CreatePartnershipDto } from './dto/create-partnership.dto';
import { UpdatePartnershipDto } from './dto/update-partnership.dto';

@Injectable()
export class PartnershipService {
  create(createPartnershipDto: CreatePartnershipDto) {
    return 'This action adds a new partnership';
  }

  findAll() {
    return `This action returns all partnership`;
  }

  findOne(id: number) {
    return `This action returns a #${id} partnership`;
  }

  update(id: number, updatePartnershipDto: UpdatePartnershipDto) {
    return `This action updates a #${id} partnership`;
  }

  remove(id: number) {
    return `This action removes a #${id} partnership`;
  }
}
