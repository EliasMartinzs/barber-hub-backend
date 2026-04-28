import { Injectable } from '@nestjs/common';
import { handlePrismaError } from 'src/common/prisma/errors/handle-prisma-error';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { CreateServiceDto } from 'src/service/dto/create-service.dto';
import { EditServiceDto } from 'src/service/dto/edit-service.dto';

@Injectable()
export class ServiceService {
  constructor(private readonly prisma: PrismaService) {}

  async createService(tenantId: string, service: CreateServiceDto) {
    try {
      return await this.prisma.service.create({
        data: {
          tenantId,
          ...service,
        },
      });
    } catch (e) {
      handlePrismaError(e);
    }
  }

  async editService(id: string, data: EditServiceDto) {
    try {
      return await this.prisma.service.update({
        where: { id },
        data,
      });
    } catch (e) {
      handlePrismaError(e);
    }
  }

  async deleteService(id: string) {
    try {
      return await this.prisma.service.delete({
        where: { id },
      });
    } catch (e) {
      handlePrismaError(e);
    }
  }
}
