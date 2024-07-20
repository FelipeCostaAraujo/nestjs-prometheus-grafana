import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { UserDTO } from './dto/user.dto';
import { Roles } from 'src/roles/roles.decorator';
import { RolesGuard } from 'src/roles/roles.guard';

@Controller('users')
@UseGuards(RolesGuard)
export class UsersController {
  constructor(private userService: UsersService) {}

  @Post()
  @Roles('admin')
  createUser(@Body() user: UserDTO) {
    return this.userService.create(user);
  }

  @Get()
  @Roles('admin')
  getAllUsers() {
    return this.userService.findAll();
  }
}
