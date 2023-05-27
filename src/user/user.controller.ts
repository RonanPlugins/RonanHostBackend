import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiBody, ApiCookieAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { User } from './entities/user.entity';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  @ApiCookieAuth('JWT Token')
  @ApiBody({ type: User })
  async getProfile(@Req() req): Promise<User> {
    return this.userService.findOne(req.user.id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiCookieAuth('JWT Token')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }

  @Post('generateResetToken')
  async generateResetToken(@Body() body: { email: string }): Promise<string> {
    return await this.userService.generateResetToken(body.email);
  }

  @Get('resetPassword/:token')
  @Post('generateResetToken/:email')
  async resetPassword(
    @Param('token') token: string,
    @Body() body: { newPassword: string },
  ) {
    await this.userService.resetPassword(token, body.newPassword);
    return { success: true };
  }
}
