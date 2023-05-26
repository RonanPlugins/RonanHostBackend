import {
  Controller,
  Post,
  Body,
  Req,
  Get,
  Put,
  UseGuards,
  Patch,
  Param,
  Options,
  HttpStatus,
  Delete,
} from '@nestjs/common';
import { ReferralService } from './referral.service';
import { RoleAuthGuard } from '../auth/guards/role-auth.guard';
import { ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/common/decorators/roles.decorator';
import { UserRole } from 'src/user/user-role.enum';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { ReferralEntity } from './referral.entity';
import { ReferralDto, TokenDto } from './referral.dto';

@Controller('referral')
@ApiTags('referral')
export class ReferralController {
  constructor(private readonly referralService: ReferralService) {}

  @Options()
  options(): any {
    return {
      statusCode: HttpStatus.OK,
      message: 'The following methods are supported for this route',
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    };
  }

  @Put('use')
  async useReferral(@Body() body: TokenDto) {
    // Call the referral service to handle the referral token and IP address
    await this.referralService.handleReferralToken(body.token);

    return { message: 'Referral token used successfully' };
  }

  @UseGuards(JwtAuthGuard, RoleAuthGuard)
  @Roles(UserRole.ADMIN)
  @Get('list')
  async getReferrals() {
    return await this.referralService.findAll();
  }

  @UseGuards(JwtAuthGuard, RoleAuthGuard)
  @Roles(UserRole.ADMIN)
  @Post('create')
  async createReferral(@Body() referralDto: ReferralDto): Promise<any> {
    const referral = await this.referralService.createReferral(referralDto);
    return { message: 'Referral created successfully', referral };
  }

  @UseGuards(JwtAuthGuard, RoleAuthGuard)
  @Roles(UserRole.ADMIN)
  @Delete(':id/delete')
  async deleteReferral(@Param('id') id: number): Promise<any> {
    const referral = await this.referralService.deleteOne(id);
    return { message: 'Referral deleted successfully', referral };
  }

  @UseGuards(JwtAuthGuard, RoleAuthGuard)
  @Roles(UserRole.ADMIN)
  @Patch(':id/edit')
  async editReferral(
    @Param('id') id: number,
    @Body() updateReferralDto: Partial<ReferralEntity>,
  ): Promise<any> {
    await this.referralService.updateServer(id, updateReferralDto);
    return await this.referralService.findAll();
  }
}
