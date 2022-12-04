import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from 'src/modules/auth/enums/decorators/roles.decorator';
import { Role } from 'src/modules/auth/enums/role.enum';
import { ValidManager } from 'src/modules/auth/valid-manager.guard';
import { CreateGradeDto } from './dto/create-grade-dto';
import { UpdateGradeDto } from './dto/update-grade-dto';
import { Grade } from './grade.entity';
import { GradeService } from './grade.service';

@Controller('grades')
export class GradesController {
  constructor(private gradeService: GradeService) {}

  @Get('/:id')
  @UseGuards(AuthGuard('jwt'), ValidManager)
  @Roles(Role.Manager)
  getGradeById(@Param('id') id: string): Promise<Grade> {
    return this.gradeService.getGradeById(id);
  }

  @Get('/:id/subjects')
  @UseGuards(AuthGuard('jwt'), ValidManager)
  @Roles(Role.Manager)
  getSubjectsByGrade(@Param('id') id: string) {
    return this.gradeService.getSubjectsByGrade(id);
  }

  @Get()
  @UseGuards(AuthGuard('jwt'), ValidManager)
  @Roles(Role.Manager)
  getAllGrades() {
    return this.gradeService.getAllGrade();
  }

  @Get('/:number/:parallel')
  getGradeByNameAndParallel(
    @Param('number') number: number,
    @Param('parallel') parallel: string,
  ) {
    return this.gradeService.getGradeByNameAndParallel(number, parallel);
  }

  @Post()
  @UseGuards(AuthGuard('jwt'), ValidManager)
  @Roles(Role.Manager)
  createGrade(@Body() createGradeDto: CreateGradeDto) {
    return this.gradeService.createGrade(createGradeDto);
  }

  @Delete('/:id')
  @UseGuards(AuthGuard('jwt'), ValidManager)
  @Roles(Role.Manager)
  deleteGrade(@Param('id') id: string): Promise<void> {
    return this.gradeService.deleteGrade(id);
  }

  @Put(':id')
  @UseGuards(AuthGuard('jwt'), ValidManager)
  @Roles(Role.Manager)
  updateGrade(@Param('id') id: string, @Body() updateGradeDto: UpdateGradeDto) {
    return this.gradeService.updateGrade(id, updateGradeDto);
  }
}
