import { Controller, Delete, Get, Param, Patch, Post, Put } from '@nestjs/common';
import { ManagerService } from './manager.service';
import { Manager } from './manager.entity';
import { Body } from '@nestjs/common';
import { CreateorUpdateManagerDto } from './dto/create-update-manager.dto';

@Controller('manager')
export class ManagerController {
  constructor(private managerService: ManagerService) {}

  @Get('/:id')
  getManagerById(@Param('id') id: string): Promise<Manager> {
    return this.managerService.getManagerById(id);
  }

  @Post()
  createManager(@Body() createManagerDto: CreateorUpdateManagerDto) {
    return this.managerService.createManager(createManagerDto);
  }

  @Delete('/:id')
  deleteManager(@Param('id') id: string): Promise<void> {
    return this.managerService.deleteManager(id);
  }

  @Put(':id')
  updateManager(
    @Param('id') id: string,
    @Body() updateManagerDto: CreateorUpdateManagerDto,
  ) {
    return this.managerService.updateManager(id, updateManagerDto);
  }
}
