import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FeedbackEntity } from './feedback.entity/feedback.entity';
import { Repository } from 'typeorm';
import { FeedbackDto } from './feedback.dto';

@Injectable()
export class FeedbackService {
  constructor(
    @InjectRepository(FeedbackEntity)
    private feedbackEntityRepository: Repository<FeedbackEntity>,
  ) {}

  async checkIfEntityExists(column: keyof FeedbackEntity, value: any) {
    if (
      await this.feedbackEntityRepository.findOne({
        where: { [column]: value },
      })
    ) {
      throw new ConflictException(`${column} already exists`);
    }
  }

  async createFeedback(feedbackDto: FeedbackDto): Promise<FeedbackEntity> {
    const { name, ticketId, issueResolved, rating, content } = feedbackDto;
    await this.checkIfEntityExists('ticketId', ticketId);

    const feedback = new FeedbackEntity();

    feedback.name = name;
    feedback.ticketId = ticketId;
    feedback.issueResolved = issueResolved;
    feedback.rating = rating;
    feedback.content = content;

    return await this.feedbackEntityRepository.save(feedback);
  }
}
