import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Options,
  Post,
} from '@nestjs/common';
import { ApiBody, ApiDefaultResponse, ApiTags } from '@nestjs/swagger';
import { BannerService } from './banner.service';
import { BannerEntity } from './banner.entity/banner.entity';
import { BannerDto } from './banner.dto';

@Controller('banner')
@ApiTags('banner')
export class BannerController {
  constructor(private bannerService: BannerService) {}

  @Options()
  options(): any {
    return {
      statusCode: HttpStatus.OK,
      message: 'The following methods are supported for this route',
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    };
  }

  @Get()
  async findAll(): Promise<BannerEntity[]> {
    return await this.bannerService.findAll();
  }

  @Post('create')
  @ApiBody({ type: BannerEntity })
  @ApiDefaultResponse({
    description: 'Banner created successfully',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Banner created successfully' },
        host: { $ref: '#/components/schemas/BannerEntity' },
      },
    },
  })
  async create(@Body() bannerDto: BannerDto): Promise<any> {
    const banner = await this.bannerService.createBanner(bannerDto);
    return { message: 'Banner created successfully', banner };
  }
}
