import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UsePipes,
  ValidationPipe,
  UseGuards,
} from '@nestjs/common';
import { PartnerService } from './partner.service';
import { CreatePartnerDto } from './dto/create-partner.dto';
import { UpdatePartnerDto } from './dto/update-partner.dto';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { Partner } from './entities/partner.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RoleAuthGuard } from '../auth/guards/role-auth.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../user/user-role.enum';

@Controller('partner')
@ApiTags('partner')
export class PartnerController {
  constructor(private readonly partnerService: PartnerService) {}

  @Post()
  @ApiBody({ type: CreatePartnerDto })
  @UsePipes(new ValidationPipe())
  create(@Body() createPartnerDto: CreatePartnerDto): Promise<Partner> {
    return this.partnerService.create(createPartnerDto);
  }

  @Get()
  findAll() {
    return this.partnerService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.partnerService.findOne(+id);
  }

  @Patch(':id')
  @ApiBody({ type: UpdatePartnerDto })
  @UsePipes(new ValidationPipe())
  @UseGuards(JwtAuthGuard, RoleAuthGuard)
  @Roles(UserRole.ADMIN)
  update(@Param('id') id: string, @Body() updatePartnerDto: UpdatePartnerDto) {
    return this.partnerService.update(+id, updatePartnerDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RoleAuthGuard)
  @Roles(UserRole.ADMIN)
  remove(@Param('id') id: string) {
    return this.partnerService.remove(+id);
  }
}
