import { CreateStudentDto } from "../../students/dto/create-student.dto";
import { CreateTeacherDto } from "../../teachers/dto/create-teacher.dto";

export class ValidateGradesMatchDto {
  students: CreateStudentDto[];

  teachers: CreateTeacherDto[];
}
