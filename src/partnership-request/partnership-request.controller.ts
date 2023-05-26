import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { PartnershipRequestService } from './partnership-request.service';
import { CreatePartnershipRequestDto } from './dto/create-partnership-request.dto';
import { UpdatePartnershipRequestDto } from './dto/update-partnership-request.dto';
import { ApiTags } from '@nestjs/swagger';

@Controller('partnership-request')
@ApiTags('partnership-request')
export class PartnershipRequestController {
  constructor(
    private readonly partnershipRequestService: PartnershipRequestService,
  ) {}

  @Post()
  create(@Body() createPartnershipRequestDto: CreatePartnershipRequestDto) {
    return this.partnershipRequestService.create(createPartnershipRequestDto);
  }

  @Get()
  findAll() {
    return this.partnershipRequestService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.partnershipRequestService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updatePartnershipRequestDto: UpdatePartnershipRequestDto,
  ) {
    return this.partnershipRequestService.update(
      +id,
      updatePartnershipRequestDto,
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.partnershipRequestService.remove(+id);
  }
}
