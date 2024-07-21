import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { jwtConstants } from './constants';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './auth.guard';
import { PrismaService } from 'src/prisma/prisma.service';
import { makeCounterProvider, makeHistogramProvider } from '@willsoto/nestjs-prometheus';

@Module({
  imports: [
    UsersModule,
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '9000s' },
    }),
  ],
  providers: [
    AuthService,
    PrismaService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    makeCounterProvider({
      name: "auth_login_success_total",
      help: "metric_help",
      labelNames: ['method', 'status'],
    }),
    makeCounterProvider({
      name: "auth_login_failure_total",
      help: "metric_help",
      labelNames: ['method', 'status'],
     }),
    makeCounterProvider({
      name: "auth_signup_total",
      help: "metric_help",
      labelNames: ['method', 'status'],
    }),
    makeHistogramProvider({
      name: "auth_request_duration_seconds",
      help: "metric_help",
      labelNames: ['method', 'status'],
    }),
  ],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
