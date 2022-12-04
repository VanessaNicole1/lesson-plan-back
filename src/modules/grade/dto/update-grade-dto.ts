import { Subject } from 'src/modules/subjects/subject.entity';

export class UpdateGradeDto {
  number: number;
  parallel: string;
  subjects: Subject[];
}
