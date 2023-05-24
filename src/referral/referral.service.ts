import { Injectable, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { ReferralEntity } from './referral.entity/referral.entity';
import { ReferralDto } from './referral.dto';

@Injectable()
export class ReferralService {
  constructor(
    @InjectRepository(ReferralEntity)
    private readonly referralRepository: Repository<ReferralEntity>,
  ) {}

  findAll(): Promise<ReferralEntity[]> {
    return this.referralRepository.find();
  }

  async checkIfEntityExists(column: keyof ReferralEntity, value: any) {
    if (await this.referralRepository.findOne({ where: { [column]: value } })) {
      throw new ConflictException(`${column} already exists`);
    }
  }

  async handleReferralToken(token: string): Promise<void> {
    // Check if the referral token exists in the database
    const referral = await this.referralRepository.findOne({
      where: { token: token },
    });

    if (referral) {
      // Increment the number of uses for the referral
      referral.uses += 1;
      await this.referralRepository.save(referral);
    }
  }
  async createReferral(refferalDto: ReferralDto): Promise<ReferralEntity> {
    const { token, uses, owner, additional_info } = refferalDto;
    await this.checkIfEntityExists('token', token);

    const referral = new ReferralEntity();
    referral.token = token;
    referral.uses = 0;
    referral.owner = owner;
    referral.additional_info = additional_info;

    return await this.referralRepository.save(referral);
  }

  findOne(id: number): Promise<ReferralEntity> {
    return this.referralRepository.findOne({ where: { id } });
  }

  deleteOne(id: number): Promise<ReferralEntity> {
    return new Promise<ReferralEntity>((resolve, reject) => {
      const deletedEntity = this.referralRepository.findOne({ where: { id } }); // Get the entity before deleting
      this.referralRepository
        .delete(id)
        .then(() => resolve(deletedEntity))
        .catch(reject);
    });
  }

  async updateServer(
    id: number,
    data: Partial<ReferralEntity>,
  ): Promise<ReferralEntity> {
    await this.referralRepository.update(id, data);
    return await this.findOne(id);
  }
}
