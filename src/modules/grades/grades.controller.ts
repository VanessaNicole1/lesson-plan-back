import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  UseGuards,
} from '@nestjs/common';
import { GradesService } from './grades.service';
import { CreateGradeDto } from './dto/create-grade.dto';
import { UpdateGradeDto } from './dto/update-grade.dto';
import { ValidateGradesMatchDto } from './dto/validate-grades-match.dto';
import { FilterGradeDto } from './dto/filter-grade.dto';
import { I18n, I18nContext } from 'nestjs-i18n';
import { AuthenticationGuard } from '../common/guards/authentication.guard';
import { ValidManager } from '../../utils/guards/valid-manager.guard';
import { Roles } from '../../utils/decorators/roles.decorator';
import { Role } from '../../utils/enums/roles.enum';

@Controller('grades')
export class GradesController {
  constructor(private readonly gradesService: GradesService) {}

  @Post('create')
  @UseGuards(AuthenticationGuard, ValidManager)
  @Roles(Role.Manager)
  create(@Body() createGradeDto: CreateGradeDto) {
    return this.gradesService.create(createGradeDto);
  }

  @Post()
  @UseGuards(AuthenticationGuard, ValidManager)
  @Roles(Role.Manager)
  findAll(@Body() filterGradeDto: FilterGradeDto) {
    return this.gradesService.findAll(filterGradeDto);
  }

  @Get(':id')
  @UseGuards(AuthenticationGuard, ValidManager)
  @Roles(Role.Manager)
  findOne(@Param('id') id: string) {
    return this.gradesService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(AuthenticationGuard, ValidManager)
  @Roles(Role.Manager)
  update(@Param('id') id: string, @Body() updateGradeDto: UpdateGradeDto) {
    return this.gradesService.update(+id, updateGradeDto);
  }

  @Delete(':id')
  @UseGuards(AuthenticationGuard, ValidManager)
  @Roles(Role.Manager)
  remove(@Param('id') id: string) {
    return this.gradesService.remove(+id);
  }

  @Post('validate')
  @HttpCode(200)
  validateGradesMatch(
    @Body() validateGradesMatchDto: ValidateGradesMatchDto,
    @I18n() i18nContext: I18nContext,
  ) {
    return this.gradesService.validateGradesMatch(
      validateGradesMatchDto,
      i18nContext,
    );
  }
}
