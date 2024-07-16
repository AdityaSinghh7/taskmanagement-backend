import { IsOptional, IsString } from "class-validator";

export class UpdateCityOrAddressDto{
    @IsOptional()
    @IsString()
    city?: string;

    @IsOptional()
    @IsString()
    address?: string;
}