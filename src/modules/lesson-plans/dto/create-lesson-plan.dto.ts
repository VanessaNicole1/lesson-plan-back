import { IsArray, IsDateString, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateLessonPlanDto {
    @IsNotEmpty()
    @IsDateString()
    date: Date;

    @IsNotEmpty()
    @IsString()
    topic: string;
    
    @IsNotEmpty()
    @IsString()
    content: string;
    
    @IsNotEmpty()
    @IsString()
    scheduleId: string;

    @IsOptional()
    @IsArray()
    resources?: Array<{}>;
}
