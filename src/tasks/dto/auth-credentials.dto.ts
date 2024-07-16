import { IsString, Length, Matches, MaxLength, MinLength, IsNotEmpty} from "class-validator";

export class AuthCredentialsDto{
    
    @IsString()
    @IsNotEmpty()
    @MaxLength(20)
    @MinLength(4)
    username: string;
    
    @IsString()
    @IsNotEmpty()
    @MaxLength(20)
    @MinLength(8)
    @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
        { message: "Password must be between 8-20 characters long and include at least one lowercase letter, one uppercase letter, one digit, and one special character"}
    )
    password: string;
}