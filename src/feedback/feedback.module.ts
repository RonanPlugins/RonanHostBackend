import { Module } from '@nestjs/common';
import { UserModule } from '../user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FeedbackEntity } from './feedback.entity';
import { FeedbackService } from './feedback.service';
import { FeedbackController } from './feedback.controller';

@Module({
  imports: [TypeOrmModule.forFeature([FeedbackEntity]), UserModule],
  providers: [FeedbackService],
  controllers: [FeedbackController],
  exports: [FeedbackService, TypeOrmModule],
})
export class FeedbackModule {}
