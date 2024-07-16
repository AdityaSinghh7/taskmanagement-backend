import { IsNotEmpty, IsString, Length, Matches } from "class-validator";
import { AuthCredentialsDto } from "./auth-credentials.dto";

export class SignUpDto extends AuthCredentialsDto{
    @IsString()
    @IsNotEmpty({ message: `"city" field in body cannot be empty` })
    @Length(2, 50)
    @Matches(/^[a-zA-Z\s]*$/, { message: 'City can only contain letters and spaces' })
    city: string;


    @IsString()
    @IsNotEmpty({ message: `"address" field in body cannot be empty` })
    @Length(5, 100)
    address: string;
}