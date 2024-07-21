import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { PrismaService } from './prisma/prisma.service';
import { makeCounterProvider, PrometheusModule } from '@willsoto/nestjs-prometheus';
import { MetricsController } from './metrics/metrics.controller';

@Module({
  imports: [
    AuthModule,
    UsersModule,
    PrometheusModule.register({
      controller: MetricsController,
      path: 'app-metrics',
      defaultMetrics: {
        enabled: false,
      },
    }),
  ],
  controllers: [AppController, MetricsController],
  providers: [
    AppService,
     PrismaService,
     makeCounterProvider({
      name: "hello_world",
      help: "metric_help",
    }),
    ],
})
export class AppModule {}
