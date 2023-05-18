import { IsInt, IsNotEmpty } from "class-validator";

export class CreateMinimumNumberOfStudentsToEvaluateDto  {
    @IsNotEmpty()
    @IsInt()
    minimumNumber: number;
}
