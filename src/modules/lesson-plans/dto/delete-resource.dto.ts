import { IsString } from 'class-validator';

export class DeleteResourceDto {
    @IsString()
    name: string;
}
