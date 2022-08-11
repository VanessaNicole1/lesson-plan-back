import { PeriodsService } from './period.service';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { Period } from './period.entity';
import { CreatePeriodDto } from './dto/create-period-dto';
import { UpdatePeriodDto } from './dto/update-period-dto';

@Controller('periods')
export class PeriodsController {
  constructor(private periodsService: PeriodsService) {}

  @Get('/:id')
  getPeriodById(@Param('id') id: string): Promise<Period> {
    return this.periodsService.getPeriodById(id);
  }

  @Get()
  getAllTeachers() {
    return this.periodsService.getAllPeriod();
  }

  @Post()
  createPeriod(@Body() createPeriodDto: CreatePeriodDto) {
    return this.periodsService.createPeriod(createPeriodDto);
  }

  @Delete('/:id')
  deletePeriod(@Param('id') id: string): Promise<void> {
    return this.periodsService.deletePeriod(id);
  }

  @Put(':id')
  updateTeacher(
    @Param('id') id: string,
    @Body() updatePeriodDto: UpdatePeriodDto,
  ) {
    return this.periodsService.updatePeriod(id, updatePeriodDto);
  }
}
