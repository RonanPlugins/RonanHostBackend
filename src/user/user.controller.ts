import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Options,
  Param,
  Post,
  Req,
  Request,
  UnauthorizedException,
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
import { UserEntity } from './user.entity';
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
    return await this.userService.findOneById(req.user.id);
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

  @Post('generateResetToken/:email')
  @ApiDefaultResponse({
    description: 'Password reset token generated successfully',
    schema: {
      type: 'object',
      properties: {
        resetToken: {
          type: 'string',
          example: 'a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6',
        },
      },
    },
  })
  async generateResetToken(@Param('email') email: string): Promise<string> {
    return await this.userService.generateResetToken(email);
  }
  @Get('resetPassword/:token')
  @Post('generateResetToken/:email')
  @ApiDefaultResponse({
    description: 'Password reset successfully',
    schema: {
      type: 'object',
      properties: {
        success: {
          type: 'boolean',
          example: 'true',
        },
      },
    },
  })
  async resetPassword(
    @Param('token') token: string,
    @Body() body: { newPassword: string },
  ) {
    await this.userService.resetPassword(token, body.newPassword);
    return { success: true };
  }
}
