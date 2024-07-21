import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { SignUpDto } from './dto/sign-up.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { InjectMetric } from '@willsoto/nestjs-prometheus';
import { Counter, Histogram } from 'prom-client';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private prismaService: PrismaService,
    @InjectMetric('auth_login_success_total') private readonly loginSuccessCounter: Counter<string>,
    @InjectMetric('auth_login_failure_total') private readonly loginFailureCounter: Counter<string>,
    @InjectMetric('auth_signup_total') private readonly signupCounter: Counter<string>,
    @InjectMetric('auth_request_duration_seconds') private readonly requestDurationHistogram: Histogram<string>
  ) {}

  async signIn(email: string, password: string): Promise<{ access_token: string }> {
    const end = this.requestDurationHistogram.startTimer({ method: 'signIn' });
    const user = await this.prismaService.user.findFirst({
      where: { email: email },
    });

    if (!user) {
      this.loginFailureCounter.inc();
      end({ status: 'failure' });
      throw new UnauthorizedException();
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      this.loginFailureCounter.inc();
      end({ status: 'failure' });
      throw new UnauthorizedException();
    }

    const payload = {
      sub: user.id,
      username: user.name,
      role: user.role,
      email: user.email,
    };

    this.loginSuccessCounter.inc();
    end({ status: 'success' });
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  async signUp(signUpDto: SignUpDto) {
    const end = this.requestDurationHistogram.startTimer({ method: 'signUp' });
    const userInDb = await this.prismaService.user.findFirst({
      where: { email: signUpDto.email },
    });

    if (userInDb) {
      end({ status: 'failure' });
      throw new UnauthorizedException('User already exists');
    }

    const user = await this.prismaService.user.create({
      data: {
        name: signUpDto.username,
        email: signUpDto.email,
        password: await bcrypt.hash(signUpDto.password, 10),
      },
    });
    const payload = {
      sub: user.id,
      username: user.name,
      role: user.role,
      email: user.email,
    };

    this.signupCounter.inc();
    end({ status: 'success' });
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
