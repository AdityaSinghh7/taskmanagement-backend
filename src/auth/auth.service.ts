import { Injectable, Logger, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './jwt-payload.interface';
import { SignUpDto } from 'src/tasks/dto/sign-up.dto';
import { SignInDto } from 'src/tasks/dto/sign-in.dto';
import { UpdateCityOrAddressDto } from 'src/tasks/dto/update-city-address.dto';
import { User } from './user.entity';


@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(UserRepository)
        private userRepository: UserRepository,
        private jwtService: JwtService,
    ){}
    private logger = new Logger();

    async signUp(signUpDto: SignUpDto): Promise<void>
    {
        return this.userRepository.signUp(signUpDto);
    }

    async signIn(signInDto: SignInDto): Promise<{accessToken : string}> {
        const username = await this.userRepository.validateUserPassword(signInDto);
        if(!username){
            throw new UnauthorizedException('Invalid credentials');
        }

        const payload: JwtPayload = {username};
        const accessToken = await this.jwtService.sign(payload);
        // this.logger.debug(`Generated JWT token with payload ${JSON.stringify(payload)}`);

        return {accessToken};
    }

    async updateCityOrAddress(id: number, updateUserDto: UpdateCityOrAddressDto): Promise<void>{
        const {city, address} = updateUserDto;

        const user = await this.userRepository.findOne({where: {id}});

        if(!user){
            throw new NotFoundException(`User with ID: ${id} not found`);
        }

        

        if(city){
            user.city = city;
        }

        if(address){
            user.address = address;
        }

        await user.save();
    }

}
