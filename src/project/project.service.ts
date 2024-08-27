import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { CreateProjectPartialDto } from './dto/create-project.partial.dto';

@Injectable()
export class ProjectService {
  constructor(private prisma: PrismaService) { }

  //TODO: seul l'utilisateur connecter pour créer un projet avec sont userID une comparaison du token et du userId dois être fait.
  async create(userId: string, createProjectDto: CreateProjectPartialDto) {
    const project = await this.prisma.project.create({
      data: {
        name: createProjectDto.name,
        description: createProjectDto.description,
        userId: userId, // Associe automatiquement le userId à partir du token
      },
    });
    return project;
  }

  async findAll(
    search?: string,
    page: number = 1,
    limit: number = 10,
  ) {
    const skip = (page - 1) * limit;
    const projects = await this.prisma.project.findMany({
      where:{
        name: {
          contains: search,
          mode: "insensitive"
        }
      },
      orderBy: {
        createdAt: 'desc', // Sorting by date (newest first)
      },
      skip,
      take: +limit,
      include: {
        user: true,
        feedbacks: true,
      },
    });

    return projects;
  }


  async findOne(id: string) {
    const project = await this.prisma.project.findUnique({
      where: { id },
      include: {
        user: true,
        feedbacks: true,
        // TODO: a essayer
        // feedbacks: {
        //   select: { id: true },
        // },
      },
    });

    if (!project) {
      throw new NotFoundException(`Project with ID ${id} not found`);
    }
    return project;
  }

  async update(id: string, updateProjectDto: UpdateProjectDto) {
    const project = await this.prisma.project.update({
      where: { id },
      data: {
        ...updateProjectDto,
      },
    });

    if (!project) {
      throw new NotFoundException(`Project with ID ${id} not found`);
    }
    return project;
  }

  async remove(id: string) {
    const project = await this.findOne(id);
    if (!project) {
      throw new NotFoundException(`Project with ID ${id} not found`);
    }
    return this.prisma.project.delete({ where: { id } });
  }
}
