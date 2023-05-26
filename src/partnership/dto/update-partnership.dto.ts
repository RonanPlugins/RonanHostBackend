import { PartialType } from '@nestjs/swagger';
import { CreatePartnershipDto } from './create-partnership.dto';

export class UpdatePartnershipDto extends PartialType(CreatePartnershipDto) {}
