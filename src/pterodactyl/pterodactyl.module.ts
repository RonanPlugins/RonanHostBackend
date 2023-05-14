import { Module } from '@nestjs/common';
import { PterodactylService } from './pterodactyl.service';
import { PterodactylController } from './pterodactyl.controller';

@Module({
  providers: [PterodactylService],
  controllers: [PterodactylController]
})
export class PterodactylModule {}
