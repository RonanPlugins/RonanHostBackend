import { Body, Controller, HttpStatus, Options, Post } from '@nestjs/common';
import { ApiBody, ApiDefaultResponse, ApiTags } from '@nestjs/swagger';
import { UserService } from '../user/user.service';
import { FeedbackDto } from './feedback.dto';
import { FeedbackEntity } from './feedback.entity';
import { FeedbackService } from './feedback.service';

@Controller('feedback')
@ApiTags('feedback')
export class FeedbackController {
  constructor(
    private feedbackService: FeedbackService,
    private userService: UserService,
  ) {}

  @Options()
  options(): any {
    return {
      statusCode: HttpStatus.OK,
      message: 'The following methods are supported for this route',
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    };
  }
  @Post('create')
  @ApiBody({ type: FeedbackEntity })
  @ApiDefaultResponse({
    description: 'Feedback created successfully',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Feedback created successfully' },
        host: { $ref: '#/components/schemas/FeedbackEntity' },
      },
    },
  })
  async create(@Body() feedbackDto: FeedbackDto): Promise<any> {
    const feedback = await this.feedbackService.createFeedback(feedbackDto);
    return { message: 'Feedback created successfully', feedback };
  }
}
