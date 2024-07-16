import { Type } from "class-transformer";
import { IsISO8601, IsNotEmpty, MinDate } from "class-validator";

export class CreateTaskDto {
    @IsNotEmpty()
    title: string;

    @IsNotEmpty()
    description: string;

    @IsNotEmpty()
    @Type(() => Date) 
    @MinDate(new Date()) 
    date: Date;

}