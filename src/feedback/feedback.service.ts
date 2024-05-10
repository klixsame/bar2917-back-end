import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { FeedbackDto } from './feedback.dto';
import { returnFeedbackObject } from './return-feedback.object';


@Injectable()
export class FeedbackService {
  constructor(private prisma: PrismaService) {}

  async getAllFeedbacks() {
    return this.prisma.feedback.findMany({
      orderBy: {
        createdAt: 'desc'
      },
      select: returnFeedbackObject
    });
  }

  async createFeedback(userId: number, dto: FeedbackDto) {
    return this.prisma.feedback.create({
      data: {
        ...dto,
        user: {
          connect: {
            id: userId
          }
        }
      }
    });
  }
}
