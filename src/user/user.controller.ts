import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import {
  ApiBody,
  ApiCookieAuth,
  ApiDefaultResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UserService } from './user.service';
import { UserEntity } from './user.entity/user.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UserDto } from './user.dto';

@Controller('user')
@ApiTags('user')
export class UserController {
  constructor(private userService: UserService) {}
  @Post('register')
  @UsePipes(new ValidationPipe())
  @ApiBody({ type: UserEntity })
  @ApiDefaultResponse({
    description: 'User created successfully',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'User created successfully' },
        host: { $ref: '#/components/schemas/UserEntity' },
      },
    },
  })
  async register(@Body() userDto: UserDto): Promise<any> {
    const user = await this.userService.createUser(userDto);
    return { message: 'User created successfully', user };
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  @ApiCookieAuth('JWT Token')
  @ApiBody({ type: UserEntity })
  @ApiDefaultResponse({
    description: 'User created successfully',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'User created successfully' },
        HostEntity: { $ref: '#/components/schemas/UserEntity' },
      },
    },
  })
  async getProfile(@Req() req): Promise<any> {
    const userEntity = await this.userService.findOneById(req.user.id);
    return { userEntity };
  }
}
