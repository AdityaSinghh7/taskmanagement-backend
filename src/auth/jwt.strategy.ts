import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy, ExtractJwt } from 'passport-jwt';
import { JwtPayload } from "./jwt-payload.interface";
import { InjectRepository } from "@nestjs/typeorm";
import { UserRepository } from "./user.repository";
import * as config from 'config';


const jwtConfig: JWTConfig = config.get('jwt');

interface JWTConfig {
    expiresIn: number;
    secret: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        @InjectRepository(UserRepository)
        private userRepository: UserRepository,
    ){
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: process.env.JWT_SECRET || jwtConfig.secret,
        });
    }

    async validate(payload: JwtPayload){
        const {username} = payload;
        const user = await this.userRepository.findOne({ where: { username } });

        if(!user){
            throw new UnauthorizedException('Invalid credentials');
        }

        return user;
    }

}