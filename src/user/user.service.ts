import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';

import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async findOneByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async create(data: CreateUserDto) {
    const hashedPassword = await bcrypt.hash(data.password, 10);
    const user = await this.prisma.user.create({
      data: { ...data, password: hashedPassword },
    });
    return user;
  }

  async findAll() {
    const users = await this.prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        projects: true,
        comments: true
      },
    });
    return users;
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        projects: true,
        comments: true
      },
    });
    if (!user) {
      throw new NotFoundException(`Utilisateur with ID ${id} not found`);
    }
    return user;
  }

  async update(id: string, updateUtilisateurDto: UpdateUserDto) {
    const hashedPassword = updateUtilisateurDto.password
      ? await bcrypt.hash(updateUtilisateurDto.password, 10)
      : undefined;

    const user = await this.prisma.user.update({
      where: { id },
      data: {
        ...updateUtilisateurDto,
        ...(hashedPassword && { mot_de_passe: hashedPassword }),
      },
    });
    if (!user) {
      throw new NotFoundException(`Utilisateur with ID ${id} not found`);
    }
    return user;
  }

  async remove(id: string) {
    const user = await this.findOne(id);
    if (!user) {
      throw new NotFoundException(`Utilisateur with ID ${id} not found`);
    }
    return this.prisma.user.delete({ where: { id } });
  }
}
