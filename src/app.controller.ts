import { Controller, Get, HttpStatus, Options } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Options()
  options(): any {
    return {
      statusCode: HttpStatus.OK,
      message: 'The following methods are supported for this route',
      methods: ['GET', 'POST', 'PUT', 'DELETE'],
    };
  }

  @Get('status')
  status(): any {
    return {
      statusCode: HttpStatus.OK,
      message: 'API is online.',
    };
  }
}
