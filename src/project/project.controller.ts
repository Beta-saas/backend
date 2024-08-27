import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  HttpException,
  HttpStatus,
  Request,
  Query,
  ParseBoolPipe,
  DefaultValuePipe,
} from '@nestjs/common';
import { ProjectService } from './project.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { JwtAuthGuard } from 'src/jwt-auth.guard';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtService } from '@nestjs/jwt';
import { CreateProjectPartialDto } from './dto/create-project.partial.dto';

@ApiTags('projects')
@Controller('project')
export class ProjectController {
  constructor(private readonly projectService: ProjectService, private readonly jwtService: JwtService  ) { }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post()
  @ApiOperation({ summary: 'Create a new project' })
  @ApiResponse({ status: 201, description: 'The project has been successfully created.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  async create(@Body() createProjectDto: CreateProjectPartialDto, @Request() req) {
    try {
      // Extract token from header
      const authHeader = req.headers.authorization;
      // Extract token from header
      const token = authHeader?.replace('Bearer ', '');
      
      if (!token) {
        throw new HttpException('Authorization token is missing', HttpStatus.UNAUTHORIZED);
      }

      // Decode the token to get the userId
      
      const decodedToken = this.jwtService.decode(token) as { sub: string };
      const userId = decodedToken?.sub;

      if (!userId) {
        throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);
      }

      // Pass the userId to the service
      const project = await this.projectService.create(userId, createProjectDto);
      return project;
    } catch (error) {
      throw new HttpException('Error creating project', HttpStatus.BAD_REQUEST);
    }
  }

  @Get()
  @ApiOperation({ summary: 'Get all projects' })
  @ApiQuery({ name: 'search', required: false, description: 'Search term to filter projects by name', type: String })
  @ApiQuery({ name: 'page', required: true, description: 'Page number for pagination', type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: true, description: 'Number of items per page', type: Number, example: 10 })
  @ApiResponse({ status: 200, description: 'Return all projects.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  async findAll(
    @Query('search') search?: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10
  ) {
    try {
      return await this.projectService.findAll(search, page, limit);
    } catch (error) {
      throw new HttpException('Error fetching projects', HttpStatus.BAD_REQUEST);
    }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a project by ID' })
  @ApiResponse({ status: 200, description: 'Return the project.' })
  @ApiResponse({ status: 404, description: 'Project not found.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  async findOne(@Param('id') id: string) {
    try {
      const project = await this.projectService.findOne(id);
      if (!project) {
        throw new HttpException('Project not found', HttpStatus.NOT_FOUND);
      }
      return project;
    } catch (error) {
      throw new HttpException('Error fetching project', HttpStatus.BAD_REQUEST);
    }
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Patch(':id')
  @ApiOperation({ summary: 'Update a project by ID' })
  @ApiResponse({ status: 200, description: 'The project has been successfully updated.' })
  @ApiResponse({ status: 404, description: 'Project not found.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  async update(@Param('id') id: string, @Body() updateProjectDto: UpdateProjectDto) {
    try {
      const project = await this.projectService.update(id, updateProjectDto);
      if (!project) {
        throw new HttpException('Project not found', HttpStatus.NOT_FOUND);
      }
      return project;
    } catch (error) {
      throw new HttpException('Error updating project', HttpStatus.BAD_REQUEST);
    }
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a project by ID' })
  @ApiResponse({ status: 200, description: 'The project has been successfully deleted.' })
  @ApiResponse({ status: 404, description: 'Project not found.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  async remove(@Param('id') id: string) {
    try {
      const result = await this.projectService.remove(id);
      if (!result) {
        throw new HttpException('Project not found', HttpStatus.NOT_FOUND);
      }
      return result;
    } catch (error) {
      throw new HttpException('Error deleting project', HttpStatus.BAD_REQUEST);
    }
  }
}
