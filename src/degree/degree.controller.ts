import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { DegreeService } from './degree.service';
import { Degree } from './degree.entity';
import { CreateDegreeDto } from './dto/create-degree-dto';
import { UpdateDegreeDto } from './dto/update-degree-dto';

@Controller('degress')
export class DegreesController {
  constructor(private degreesService: DegreeService) {}

  @Get('/:id')
  getDegreeById(@Param('id') id: string): Promise<Degree> {
    return this.degreesService.getDegreeById(id);
  }

  @Post()
  createPeriod(@Body() createDegreeDto: CreateDegreeDto) {
    return this.degreesService.createDegree(createDegreeDto);
  }

  @Delete('/:id')
  deletePeriod(@Param('id') id: string): Promise<void> {
    return this.degreesService.deleteDegree(id);
  }

  updatePeriod(updateDegreeDto: UpdateDegreeDto) {
    return this.degreesService.updateDegree(updateDegreeDto);
  }
}
