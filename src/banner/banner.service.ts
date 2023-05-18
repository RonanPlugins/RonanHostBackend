import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BannerEntity } from './banner.entity/banner.entity';
import { Repository } from 'typeorm';
import { FeedbackEntity } from '../feedback/feedback.entity/feedback.entity';
import { FeedbackDto } from '../feedback/feedback.dto';
import { BannerDto } from './banner.dto';

@Injectable()
export class BannerService {
  constructor(
    @InjectRepository(BannerEntity)
    private bannerEntityRepository: Repository<BannerEntity>,
  ) {}
  async checkIfEntityExists(column: keyof FeedbackEntity, value: any) {
    if (
      await this.bannerEntityRepository.findOne({
        where: { [column]: value },
      })
    ) {
      throw new ConflictException(`${column} already exists`);
    }
  }

  async createBanner(bannerDto: BannerDto): Promise<BannerEntity> {
    const { minutesBetweenPopup, clickUrl, text, enabled, allowClose, type } =
      bannerDto;

    const banner = new BannerEntity();

    banner.minutesBetweenPopup = minutesBetweenPopup;
    banner.clickUrl = clickUrl;
    banner.text = text;
    banner.enabled = enabled;
    banner.allowClose = allowClose;
    banner.type = type;

    return await this.bannerEntityRepository.save(banner);
  }
}
