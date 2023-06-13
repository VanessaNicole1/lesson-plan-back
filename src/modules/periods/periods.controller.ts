import { Controller, Get, Body, Param, Delete } from '@nestjs/common';
import { PeriodsService } from './periods.service';
import { FilterPeriodDto } from './dto/filter-period.dto';
import { I18n, I18nContext } from 'nestjs-i18n';

@Controller('periods')
export class PeriodsController {
  constructor(private readonly periodsService: PeriodsService) {}

  @Get()
  findAll(@Body() filterPeriodDto?: FilterPeriodDto) {
    return this.periodsService.findAll(filterPeriodDto);
  }

  @Get('active')
  findActivePeriods() {
    return this.periodsService.findActivePeriods();
  }

  @Get(':id')
  findOne(@Param('id') id: string, @I18n() i18nContext: I18nContext) {
    return this.periodsService.findOne(id, i18nContext);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.periodsService.remove(id);
  }
}
