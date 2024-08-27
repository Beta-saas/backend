import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateFeedbackDto } from './dto/create-feedback.dto';
import { UpdateFeedbackDto } from './dto/update-feedback.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class FeedbackService {
  constructor(private prisma: PrismaService) { }

  async create(createFeedbackDto: CreateFeedbackDto) {
    return this.prisma.feedback.create({
      data: {
        project: {
          connect: { id: createFeedbackDto.projectId },
        },
        userEmail: createFeedbackDto.userEmail,
        type: createFeedbackDto.type,
        category: createFeedbackDto.category,
        priority: createFeedbackDto.priority,
        status: createFeedbackDto.status,
        description: createFeedbackDto.description,
        tags: createFeedbackDto.tags,
      },
    });
  }

  async findAll() {
    return this.prisma.feedback.findMany({
      include: {
        project: true,
        comments: true,
      },
    });
  }

  async findOne(id: string) {
    const feedback = await this.prisma.feedback.findUnique({
      where: { id },
      include: {
        project: true,
        comments: true,
      },
    });
    if (!feedback) {
      throw new NotFoundException(`Feedback with ID ${id} not found`);
    }
    return feedback;
  }

  async update(id: string, updateFeedbackDto: UpdateFeedbackDto) {
    const feedback = await this.prisma.feedback.findUnique({
      where: { id },
    });
    if (!feedback) {
      throw new NotFoundException(`Feedback with ID ${id} not found`);
    }
    return this.prisma.feedback.update({
      where: { id },
      data: {
        userEmail: updateFeedbackDto.userEmail,
        type: updateFeedbackDto.type,
        category: updateFeedbackDto.category,
        priority: updateFeedbackDto.priority,
        status: updateFeedbackDto.status,
        description: updateFeedbackDto.description,
        tags: updateFeedbackDto.tags,
      },
    });
  }

  async remove(id: string) {
    const feedback = await this.prisma.feedback.findUnique({
      where: { id },
    });
    if (!feedback) {
      throw new NotFoundException(`Feedback with ID ${id} not found`);
    }
    return this.prisma.feedback.delete({
      where: { id },
    });
  }
}
