import { DataSource, Repository } from "typeorm"
import { User } from "./user.entity";
import { ConflictException, Injectable, InternalServerErrorException } from "@nestjs/common";
import { AuthCredentialsDto } from "src/tasks/dto/auth-credentials.dto";
import * as bcrypt from 'bcrypt';
import { SignUpDto } from "src/tasks/dto/sign-up.dto";
import { SignInDto } from "src/tasks/dto/sign-in.dto";


@Injectable()
export class UserRepository extends Repository<User> {
    constructor(private dataSource: DataSource) {
        super(User, dataSource.createEntityManager());
    }


    async signUp(signUpDto: SignUpDto): Promise<void> {
        const { username, password, city, address } = signUpDto;
        const salt = await bcrypt.genSalt();

        const user = new User();
        user.username = username;
        user.salt = salt;
        user.password = await this.hashPassword(password, salt);
        user.city = city;
        user.address = address;
        try {
            await user.save();
        }
        catch (error) {
            if (error.code === '23505') {
                throw new ConflictException('Username already exists!')
            }
            else {
                throw new InternalServerErrorException();
            }
        }
    } 

    async validateUserPassword(signInDto: SignInDto): Promise<string>{
        const {username, password} = signInDto;
        const user = await this.findOne({where: {username}});

        if(user && await user.validatePassword(password)){
            return user.username;
        } else{
            return null;
        }
    }

    private async hashPassword(password:string, salt:string): Promise<string>{
        return bcrypt.hash(password, salt);
    }
}