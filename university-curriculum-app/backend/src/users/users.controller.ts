import { Controller, Get, Param, Post, Body } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly users: UsersService) {}

  @Get()
  list() {
    return this.users.list();
  }

  @Get(':rut')
  get(@Param('rut') rut: string) {
    return this.users.findByRut(rut);
  }

  @Post()
  create(@Body() body: any) {
    return this.users.create(body);
  }
}