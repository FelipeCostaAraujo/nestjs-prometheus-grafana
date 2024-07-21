import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from '@prisma/client';
import { InjectMetric } from '@willsoto/nestjs-prometheus';
import { Counter, Histogram } from 'prom-client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    @InjectMetric('user_find_success_total')
    private readonly userSuccessCounter: Counter<string>,
    @InjectMetric('user_find_failure_total')
    private readonly userFindFailure: Counter<string>,
    @InjectMetric('user_request_duration_seconds')
    private readonly requestDurationHistogram: Histogram<string>,
  ) {}

  async findOne(email: string): Promise<User | undefined> {
    const end = this.requestDurationHistogram.startTimer({ method: 'findOne' });
    const user = await this.prisma.user.findFirst({
      where: {
        email,
      },
    });

    if (!user) {
      this.userFindFailure.inc();
      end({ status: 'failure' });
      throw new NotFoundException('User not found');
    }

    end({ status: 'success' });
    this.userSuccessCounter.inc();
    return user;
  }

  async findAll(): Promise<User[]> {
    const end = this.requestDurationHistogram.startTimer({ method: 'findAll' });
    const users = await this.prisma.user.findMany();

    if (!users || users.length === 0) {
      this.userFindFailure.inc();
      end({ status: 'failure' });
      throw new NotFoundException('User not found');
    }

    end({ status: 'success' });
    this.userSuccessCounter.inc();
    return users;
  }
}
