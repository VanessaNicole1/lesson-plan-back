import { Grade } from 'src/grade/grade.entity';

export class UpdateDegreeDto {
  name: string;
  grades: Grade[];
}
