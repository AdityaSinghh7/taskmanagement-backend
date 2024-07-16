import { Body, Controller, Logger, Param, ParseIntPipe, Patch, Post, Req, UnauthorizedException, UseGuards, ValidationPipe } from '@nestjs/common';
import { AuthCredentialsDto } from 'src/tasks/dto/auth-credentials.dto';
import { AuthService } from './auth.service';
import { SignUpDto } from 'src/tasks/dto/sign-up.dto';
import { SignInDto } from 'src/tasks/dto/sign-in.dto';
import { AuthGuard } from '@nestjs/passport';
import { UpdateCityOrAddressDto } from 'src/tasks/dto/update-city-address.dto';
import { GetUser } from './get-user.decorator';
import { User } from './user.entity';



@Controller('auth')
export class AuthController {
    constructor(
        private authService: AuthService,
    ){}

    logger = new Logger();

    @Post('/signup')
    signUp(@Body(ValidationPipe) signUpDto: SignUpDto){
       return this.authService.signUp(signUpDto); 
    }

    @Post('/signin')
    signIn(@Body(ValidationPipe) signInDto: SignInDto): Promise<{ accessToken: string }>{
        return this.authService.signIn(signInDto);
    }

    @Patch('/update/:id')
    @UseGuards(AuthGuard())
    updateCityOrAddress(@Param('id', ParseIntPipe) id: number, 
    @Body(ValidationPipe) updateCityOrAddress: UpdateCityOrAddressDto,
    @GetUser() user: User

    ): Promise<void>{
        this.logger.debug(`Authenticated user ID: ${user.id}, Requested update user ID: ${id}`)
        if (user.id !== id) {
            throw new UnauthorizedException('You are not authorized to update this user');
        }
        return this.authService.updateCityOrAddress(id, updateCityOrAddress);
    }

    
}
