import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { Repository, FindConditions, getRepository } from 'typeorm';
import { CreateUserDto } from '../users/dto/create-users.dto';
import { AuthDTO } from './auth.dto';
import { User, UserStatus, AccountType } from '../shared/entity/users.entity';
import * as bcrypt from 'bcrypt';
import * as moment from 'moment';
import { SettingService } from '../setting/setting.service';
import { CreateUserInterestDto } from '../setting/dto/create-user-interest.dto';

@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UsersService,
        private readonly settingService: SettingService,
        private readonly jwtService: JwtService,
    ) { }

    async validateUser(login: AuthDTO): Promise<any> {
        const user = await getRepository(User)
            .createQueryBuilder('user')
            .addSelect('user.passHash')
            .where("user.email = :email", { email: login.email })
            .getOne()
        if (!user) {
            return null;
        }
        const validPass = await bcrypt.compare(login.password, user.passHash);
        if (user && validPass) {
            const { passHash, ...result } = user;
            return result;
        }
        return null;
    }

    async login(user: AuthDTO): Promise<any> {
        try {
            const validatedUser = await this.validateUser(user);
            if (!validatedUser) { return { message: "Login fail, please try again" }; }

            const payload = { email: user.email, sub: validatedUser.id };
            validatedUser.access_token = this.jwtService.sign(payload);
            return {
                user: validatedUser,
            };
        } catch (e) {
            return { message: "Login fail, please try again" };
        }

    }

    async emailUsernameValidate(e: string, u: string): Promise<any> {
        const email = await this.usersService.findOne({
            email: e,
        });
        if (email) {
            return { message: "Duplicate email, please try again" };
        }

        const username = await this.usersService.findOne({
            username: u,
        });
        if (username) {
            return { message: "Duplicate username, please try again" };
        }
        return { message: null };;
    }

    async signup(userDto: CreateUserDto): Promise<any> {
        try {
            // const u = await this.usersService.emailOrUsername(userDto.email, userDto.username);
            // if (u) {
            //     return { message: "Duplicate email or username, please try again" };
            // }

            if (!userDto.password.match('^(?=.*[a-z])(?=.*?[0-9]).{8,}$')) {
                return { message: "Min 8 character and 1 number" };
            }

            const email = await this.usersService.findOne({
                email: userDto.email,
            });
            if (email) {
                return { message: "Duplicate email, please try again" };
            }

            const username = await this.usersService.findOne({
                username: userDto.username,
            });
            if (username) {
                return { message: "Duplicate username, please try again" };
            }

            let user = new User();
            user.fuid = userDto.fuid;
            user.username = userDto.username;
            user.fullname = userDto.fullname;
            user.bio = userDto.bio;
            user.passHash = await bcrypt.hash(userDto.password, 10);
            user.email = userDto.email;
            user.gender = userDto.gender;
            user.dob = moment(userDto.dob, 'DD/MM/YYYY').toDate();
            // user.profileImageURL200X200 = userDto.profileImageURL200X200 == null ? "" : userDto.profileImageURL200X200;
            user.city = userDto.city;
            user.status = UserStatus.ACTIVE;
            user.accountType = AccountType.PUBLIC;
            user.tagged = 'A';
            user.replies = false;
            user.autoSavePost = false;
            user.newMessage = false;
            user.newFollowerRequest = false;
            user.taggedInPost = false;
            user.adminEmail = false;
            user.adminPush = false;

            user.publicAccount = userDto.publicAccount == null ? true : userDto.publicAccount;
            user.privateAccount = userDto.privateAccount == null ? false : userDto.privateAccount;;
            user.enterpriseAccount = userDto.enterpriseAccount == null ? false : userDto.enterpriseAccount;
            user.approveAccount = userDto.approveAccount == null ? false : userDto.approveAccount;
            user.createdAt = userDto.createdAt == null ? new Date() : userDto.createdAt;
            user.updatedAt = userDto.updatedAt == null ? new Date() : userDto.updatedAt;

            user = await this.usersService.save(user);
            const createUserInterestDto = [];
            for (const i of userDto.interest.split(",")) {
                createUserInterestDto.push({ userId: user.id, interestId: i, createdAt: userDto.createdAt, updatedAt: userDto.updatedAt });
            }
            this.settingService.saveUserInterest(createUserInterestDto);
            const payload = { email: user.email, sub: user.id };
            const loginUser = await this.usersService.findOne({
                email: user.email,
            });
            loginUser.access_token = this.jwtService.sign(payload);
            return {
                user: loginUser,
            };
        } catch (e) {
            return { message: "Sign up fail, please try again" };
        }


    }


}