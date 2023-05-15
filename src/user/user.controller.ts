import {
  Body,
  Controller,
  Request,
  Delete,
  Get,
  HttpStatus,
  Options,
  Param,
  Post,
  Req,
  UseGuards,
  UsePipes,
  ValidationPipe,
  UnauthorizedException,
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
import { AuthService } from '../auth/auth.service';

@Controller('user')
@ApiTags('user')
export class UserController {
  constructor(
    private userService: UserService,
    private authService: AuthService,
  ) {}

  @Options()
  options(): any {
    return {
      statusCode: HttpStatus.OK,
      message: 'The following methods are supported for this route',
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    };
  }
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

  @UseGuards(JwtAuthGuard)
  @ApiCookieAuth('JWT Token')
  @Delete(':id')
  async deleteUser(@Request() req, @Param('id') id: number): Promise<void> {
    console.log(req.cookies.token);
    const userId = await this.authService.getUserIdFromToken(req.cookies.token);
    if (userId !== id) {
      throw new UnauthorizedException('Not authorized to delete this server');
    }
    await this.userService.deleteUser(id);
  }
}
