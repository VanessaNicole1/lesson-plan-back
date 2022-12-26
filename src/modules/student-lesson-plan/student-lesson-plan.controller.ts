import { AssignStudentToLessonDto } from './dto/assign-student-lesson.dto';
import { Controller, Post } from '@nestjs/common';
import { Body } from '@nestjs/common';
import { StudentLessonPlanService } from './student-lesson-plan.service';

@Controller('student-lesson-plan')
export class StudentLessonPlanController {
  constructor(private studentLessonPlanService: StudentLessonPlanService) {}

  @Post('assign')
  assignStudentToLessonPlan(
    @Body() assignStudentLesson: AssignStudentToLessonDto,
  ) {
    return this.studentLessonPlanService.assignStudentToLessonPlan(
      assignStudentLesson,
    );
  }

  removeStudentFromLessonPlan(@Body() idStudentLessonPlan: string) {
    this.studentLessonPlanService.removeStudentFromLessonPlan(
      idStudentLessonPlan,
    );
  }
}
