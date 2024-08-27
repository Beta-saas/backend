import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  HttpException,
  HttpStatus,
  UseGuards,
  Query,
} from '@nestjs/common';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { JwtAuthGuard } from 'src/jwt-auth.guard';
import { ApiBearerAuth, ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('comments')
@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new comment' })
  @ApiResponse({ status: 201, description: 'Comment successfully created.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  async create(@Body() createCommentDto: CreateCommentDto) {
    try {
      return await this.commentService.create(createCommentDto);
    } catch (error) {
      throw new HttpException('Error creating comment', HttpStatus.BAD_REQUEST);
    }
  }

  @Get('project/:projectId')
  @ApiOperation({ summary: 'Get all comments by project ID' })
  @ApiResponse({ status: 200, description: 'Return all comments for a specific project.' })
  @ApiResponse({ status: 404, description: 'Project or comments not found.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  async findAllByProject(
    @Param('projectId') projectId: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10
  ) {
    try {
      const comments = await this.commentService.findAllByProject(projectId, page, limit);
      if (!comments || comments.length === 0) {
        throw new HttpException('No comments found for the project', HttpStatus.NOT_FOUND);
      }
      return comments;
    } catch (error) {
      throw new HttpException('Error fetching comments', HttpStatus.BAD_REQUEST);
    }
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get a comment by ID' })
  @ApiResponse({ status: 200, description: 'Return the comment.' })
  @ApiResponse({ status: 404, description: 'Comment not found.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  async findOne(@Param('id') id: string) {
    try {
      const comment = await this.commentService.findOne(id);
      if (!comment) {
        throw new HttpException('Comment not found', HttpStatus.NOT_FOUND);
      }
      return comment;
    } catch (error) {
      throw new HttpException('Error fetching comment', HttpStatus.BAD_REQUEST);
    }
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a comment by ID' })
  @ApiResponse({ status: 200, description: 'Comment successfully updated.' })
  @ApiResponse({ status: 404, description: 'Comment not found.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  async update(@Param('id') id: string, @Body() updateCommentDto: UpdateCommentDto) {
    try {
      const updatedComment = await this.commentService.update(id, updateCommentDto);
      if (!updatedComment) {
        throw new HttpException('Comment not found', HttpStatus.NOT_FOUND);
      }
      return updatedComment;
    } catch (error) {
      throw new HttpException('Error updating comment', HttpStatus.BAD_REQUEST);
    }
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a comment by ID' })
  @ApiResponse({ status: 200, description: 'Comment successfully deleted.' })
  @ApiResponse({ status: 404, description: 'Comment not found.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  async remove(@Param('id') id: string) {
    try {
      const deletedComment = await this.commentService.remove(id);
      if (!deletedComment) {
        throw new HttpException('Comment not found', HttpStatus.NOT_FOUND);
      }
      return deletedComment;
    } catch (error) {
      throw new HttpException('Error deleting comment', HttpStatus.BAD_REQUEST);
    }
  }
}
