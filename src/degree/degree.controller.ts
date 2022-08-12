import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
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

  @Put(':id')
  updateTeacher(
    @Param('id') id: string,
    @Body() updateDegreeDto: UpdateDegreeDto,
  ) {
    return this.degreesService.updateDegree(id, updateDegreeDto);
  }
}
