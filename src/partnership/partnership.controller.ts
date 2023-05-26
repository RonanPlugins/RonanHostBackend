import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { PartnershipService } from './partnership.service';
import { CreatePartnershipDto } from './dto/create-partnership.dto';
import { UpdatePartnershipDto } from './dto/update-partnership.dto';
import { ApiTags } from '@nestjs/swagger';

@Controller('partnership')
@ApiTags('partnership')
export class PartnershipController {
  constructor(private readonly partnershipService: PartnershipService) {}

  @Post()
  create(@Body() createPartnershipDto: CreatePartnershipDto) {
    return this.partnershipService.create(createPartnershipDto);
  }

  @Get()
  findAll() {
    return this.partnershipService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.partnershipService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updatePartnershipDto: UpdatePartnershipDto,
  ) {
    return this.partnershipService.update(+id, updatePartnershipDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.partnershipService.remove(+id);
  }
}
