import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { SignUpDto } from './dto/sign-up.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private prismaService: PrismaService,
  ) {}

  async signIn(email: string, password: string): Promise<{ access_token: string }> {
    const user = await this.prismaService.user.findFirst({
      where: { email: email },
    });

    if (!user) {
      console.log('user not found');
      throw new UnauthorizedException();
    }

    console.log('email found', email);
    console.log('user found', user);

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      console.log('password not match');
      throw new UnauthorizedException();
    }

    const payload = {
      sub: user.id,
      username: user.name,
      role: user.role,
      email: user.email,
    };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  async signUp(signUpDto: SignUpDto) {
    const userInDb = await this.prismaService.user.findFirst({
      where: { email: signUpDto.email },
    });

    if (userInDb) {
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
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
