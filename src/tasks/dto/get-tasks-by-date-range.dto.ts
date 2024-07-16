import { IsDateString, IsNotEmpty } from "class-validator";

export class GetTasksByDateRangeDto{
    @IsNotEmpty()
    @IsDateString()
    startDate: string;

    @IsNotEmpty()
    @IsDateString()
    endDate: string;
}