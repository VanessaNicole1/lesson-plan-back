import { Grade } from 'src/modules/grade/grade.entity';

export class UpdateDegreeDto {
  name: string;
  grades: Grade[];
}
