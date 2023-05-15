import { Body, Controller, Get, HttpStatus, Options, Param, Patch, Post, Put, Query, UseGuards } from '@nestjs/common';
import { PageService } from './page.service';
import { PageEntity } from './page.entity/page.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RoleAuthGuard } from '../auth/guards/role-auth.guard';
import { UserRole } from '../user/user-role.enum';
import { Roles } from '../common/decorators/roles.decorator';
import { PageDto } from './page.dto';
import { ApiTags } from '@nestjs/swagger';

@Controller('page')
@ApiTags('page')
export class PageController {
  constructor(private readonly pageService: PageService) {}

  @Options()
  options(): any {
    return {
      statusCode: HttpStatus.OK,
      message: 'The following methods are supported for this route',
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    };
  }
  @Get()
  async findAll(
    @Query('page') page = 0,
    @Query('take') take = 20,
  ): Promise<PageEntity[]> {
    return await this.pageService.findAll({ take: take, skip: take * page });
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<PageEntity> {
    if (Number(id)) return this.pageService.findOne(Number(id));
    else return this.pageService.findOneByName(id);
  }

  @UseGuards(JwtAuthGuard, RoleAuthGuard)
  @Roles(UserRole.ADMIN)
  @Post('create')
  async createPage(@Body() pageDto: PageDto): Promise<any> {
    const page = await this.pageService.createPage(pageDto);
    return { message: 'Page created successfully', page };
  }

  @UseGuards(JwtAuthGuard, RoleAuthGuard)
  @Roles(UserRole.ADMIN)
  @Patch(':id/edit')
  async editPage(
    @Param('id') id: number,
    @Body() updatePageDto: Partial<PageEntity>,
  ): Promise<any> {
    const page = await this.pageService.updateServer(id, updatePageDto);
    return { message: 'Page updated successfully', page };
  }
}
