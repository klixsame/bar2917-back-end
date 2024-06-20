import { Body, Controller, Get, HttpCode, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { CurrentUser } from 'src/auth/decorators/user.decorator';
import { FeedbackDto } from './feedback.dto';
import { FeedbackService } from './feedback.service';

@Controller('feedbacks')
export class FeedbackController {
  constructor(private readonly feedbackService: FeedbackService) {}

  @UsePipes(new ValidationPipe())
  @Get()
  @Auth('admin')
  async getAll() {
    return this.feedbackService.getAllFeedbacks();
  }

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Post('leave')
  @Auth()
  async leaveFeedback(@CurrentUser('id') id: number, @Body() dto: FeedbackDto) {
    return this.feedbackService.createFeedback(id, dto);
  }
}
