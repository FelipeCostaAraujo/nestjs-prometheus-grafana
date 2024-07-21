import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { makeCounterProvider } from '@willsoto/nestjs-prometheus';

@Module({
  providers: [
    UsersService,
    PrismaService,
    makeCounterProvider({
      name: 'user_find_success_total',
      help: 'metric_help',
      labelNames: ['method', 'status'],
    }),
    makeCounterProvider({
      name: 'user_find_failure_total',
      help: 'metric_help',
      labelNames: ['method', 'status'],
    }),
    makeCounterProvider({
      name: 'user_request_duration_seconds',
      help: 'metric_help',
      labelNames: ['method', 'status'],
    }),
  ],
  exports: [UsersService],
  controllers: [UsersController],
})
export class UsersModule {}
