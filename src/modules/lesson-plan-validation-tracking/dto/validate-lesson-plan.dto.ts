import { IsArray, IsNotEmpty, IsString } from "class-validator";

export class ValidateLessonPlanDto {
    @IsNotEmpty()
    @IsString()
    lessonPlanId: string;

    @IsNotEmpty()
    @IsArray()
    students?: string[];
}
