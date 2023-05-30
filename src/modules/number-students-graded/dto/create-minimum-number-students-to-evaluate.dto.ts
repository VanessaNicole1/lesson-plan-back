import { IsDefined, IsInt, IsNotEmpty } from "class-validator";
import { i18nValidationMessage } from 'nestjs-i18n';

const baseI18nKey = 'initial-process.dtos.createInitialProcessDto';
export class CreateMinimumNumberOfStudentsToEvaluateDto  {
    @IsNotEmpty()
    @IsInt()
    @IsDefined({ message: i18nValidationMessage(`${baseI18nKey}.NUMBER_STUDENTS_REQUIRED`) })
    minimumStudentsToEvaluate: number;
}
