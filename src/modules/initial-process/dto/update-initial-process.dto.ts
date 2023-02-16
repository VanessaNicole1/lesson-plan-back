import { PartialType } from '@nestjs/mapped-types';
import { CreateInitialProcessDto } from './create-initial-process.dto';

export class UpdateInitialProcessDto extends PartialType(CreateInitialProcessDto) {}
