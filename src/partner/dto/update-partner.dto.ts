import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreatePartnerDto } from './create-partner.dto';
import { IsBoolean } from 'class-validator';

export class UpdatePartnerDto extends PartialType(CreatePartnerDto) {
  @ApiProperty()
  @IsBoolean()
  accepted: boolean;
}
