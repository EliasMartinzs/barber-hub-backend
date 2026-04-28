import {
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { Prisma } from 'src/generated/prisma';

function isPrismaError(e: unknown): e is Prisma.PrismaClientKnownRequestError {
  return e instanceof Prisma.PrismaClientKnownRequestError;
}

export function handlePrismaError(e: unknown): never {
  if (isPrismaError(e)) {
    switch (e.code) {
      case 'P2002':
        throw new BadRequestException({
          message: 'Conflict while creating record',
          code: 'CONFLICT',
        });

      case 'P2025':
        throw new BadRequestException({
          message: 'Record not found',
          code: 'NOT_FOUND',
        });

      default:
        throw new BadRequestException({
          message: 'Database operation failed',
          code: 'DATABASE_ERROR',
        });
    }
  }

  throw new InternalServerErrorException({
    message: 'Unexpected server error',
    code: 'INTERNAL_ERROR',
  });
}
