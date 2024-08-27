import { Injectable, NotFoundException, HttpException, HttpStatus } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CommentService {
  constructor(private readonly prisma: PrismaService) { }

  async create(createCommentDto: CreateCommentDto) {
    try {
      return await this.prisma.comment.create({
        data: {
          content: createCommentDto.content,
          feedback: {
            connect: { id: createCommentDto.feedbackId },
          },
          user: {
            connect: { id: createCommentDto.userId },
          },
        },
      });
    } catch (error) {
      throw new HttpException('Error creating comment', HttpStatus.BAD_REQUEST);
    }
  }

  async findAllByProject(projectId: string, page: number = 1, limit: number = 10) {
    try {
      const skip = (page - 1) * limit;
      return await this.prisma.comment.findMany({
        where: { feedback: { projectId } },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
        include: { user: true },
      });
    } catch (error) {
      throw new Error('Error fetching comments by project');
    }
  }

  async findOne(id: string) {
    try {
      const comment = await this.prisma.comment.findUnique({
        where: { id },
        include: {
          feedback: true,
          user: true,
        },
      });
      if (!comment) {
        throw new NotFoundException(`Comment with ID ${id} not found`);
      }
      return comment;
    } catch (error) {
      throw new HttpException('Error fetching comment', HttpStatus.BAD_REQUEST);
    }
  }

  async update(id: string, updateCommentDto: UpdateCommentDto) {
    try {
      const comment = await this.prisma.comment.findUnique({
        where: { id },
      });
      if (!comment) {
        throw new NotFoundException(`Comment with ID ${id} not found`);
      }
      return await this.prisma.comment.update({
        where: { id },
        data: {
          content: updateCommentDto.content,
          feedback: {
            connect: { id: updateCommentDto.feedbackId },
          },
          user: {
            connect: { id: updateCommentDto.userId },
          },
        },
      });
    } catch (error) {
      throw new HttpException('Error updating comment', HttpStatus.BAD_REQUEST);
    }
  }

  async remove(id: string) {
    try {
      const comment = await this.prisma.comment.findUnique({
        where: { id },
      });
      if (!comment) {
        throw new NotFoundException(`Comment with ID ${id} not found`);
      }
      return await this.prisma.comment.delete({
        where: { id },
      });
    } catch (error) {
      throw new HttpException('Error deleting comment', HttpStatus.BAD_REQUEST);
    }
  }
}
