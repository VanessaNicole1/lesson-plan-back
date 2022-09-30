import { Subject } from 'src/subjects/subject.entity';

export class UpdateTeacherDto {
  identifier: string;
  name: string;
  lastName: string;
  email: string;
  subjects: Subject[];
}
