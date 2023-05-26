import { Controller, Get } from '@nestjs/common';
import {
  HealthCheckService,
  HttpHealthIndicator,
  HealthCheck,
  TypeOrmHealthIndicator,
} from '@nestjs/terminus';

@Controller('health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private http: HttpHealthIndicator,
    private db: TypeOrmHealthIndicator,
  ) {}

  @Get()
  @HealthCheck()
  checkAll() {
    return this.health.check([
      () =>
        this.http.pingCheck(
          'RonanHost API Docs',
          'https://api.ronanhost.com/api',
        ),
      () => this.db.pingCheck('database'),
    ]);
  }
}
