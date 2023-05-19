import { IsInt, IsNotEmpty } from "class-validator";

export class CreateMinimumNumberOfStudentsToEvaluateDto  {
    @IsNotEmpty()
    @IsInt()
    minimumStudentsToEvaluate: number;
}
