import { Subject } from 'src/subjects/subject.entity';

export class UpdateGradeDto {
  number: number;
  parallel: string;
  subjects: Subject[];
}
