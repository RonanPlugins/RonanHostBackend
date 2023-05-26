import { PartialType } from '@nestjs/swagger';
import { CreatePartnershipRequestDto } from './create-partnership-request.dto';

export class UpdatePartnershipRequestDto extends PartialType(
  CreatePartnershipRequestDto,
) {}
