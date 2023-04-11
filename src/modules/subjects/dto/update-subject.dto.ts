import { PartialType } from '@nestjs/mapped-types';
import { IsString } from 'class-validator';
import { CreateSubjectDto } from './create-subject.dto';

export class UpdateSubjectDto extends PartialType(CreateSubjectDto) {
  @IsString()
  periodId: string;
}
