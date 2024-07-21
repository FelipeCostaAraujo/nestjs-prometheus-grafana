
import {
    Body,
    Controller,
    Get,
    HttpCode,
    HttpStatus,
    Post,
    Request,
    UseGuards
  } from '@nestjs/common';
  import { AuthGuard, Public } from './auth.guard';
  import { AuthService } from './auth.service';
import { SignInDto } from './dto/sign-up.dto';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
  
  @ApiBearerAuth()
  @Controller('auth')
  export class AuthController {
    constructor(private authService: AuthService) {}
  
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Login' })
    @Public()
    @Post('login')
    signIn(@Body() signInDto: Record<string, any>) {
      return this.authService.signIn(signInDto.username, signInDto.password);
    }

    @Public()
    @ApiOperation({ summary: 'Register' })
    @Post('register')
    signUp(@Body() signUpDto: SignInDto) {
      return this.authService.signUp(signUpDto);
    }
  
    @UseGuards(AuthGuard)
    @ApiOperation({ summary: 'Profile' })
    @Get('profile')
    getProfile(@Request() req) {
      return req.user;
    }
  }
  