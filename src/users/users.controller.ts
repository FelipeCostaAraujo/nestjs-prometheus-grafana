import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { Roles } from 'src/roles/roles.decorator';
import { RolesGuard } from 'src/roles/roles.guard';
import { FindUserDTO } from './dto/find-user.dto';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';

@ApiBearerAuth()
@Controller('users')
@UseGuards(RolesGuard)
export class UsersController {
  constructor(private userService: UsersService) {}

  @Post()
  @Roles('admin')
  @ApiOperation({ summary: 'Find user Admin Only' })
  createUser(@Body() user: FindUserDTO) {
    return this.userService.findOne(user.email);
  }

  @Get()
  @Roles('admin')
  @ApiOperation({ summary: 'Find all users Admin Only' })
  getAllUsers() {
    return this.userService.findAll();
  }
}
