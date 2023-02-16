import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { InitialProcessService } from './initial-process.service';
import { CreateInitialProcessDto } from './dto/create-initial-process.dto';
import { UpdateInitialProcessDto } from './dto/update-initial-process.dto';

@Controller('initial-process')
export class InitialProcessController {
  constructor(private readonly initialProcessService: InitialProcessService) {}

  @Post()
  create(@Body() createInitialProcessDto: CreateInitialProcessDto) {
    return this.initialProcessService.create(createInitialProcessDto);
  }

  @Get()
  findAll() {
    return this.initialProcessService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.initialProcessService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateInitialProcessDto: UpdateInitialProcessDto) {
    return this.initialProcessService.update(+id, updateInitialProcessDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.initialProcessService.remove(+id);
  }
}
