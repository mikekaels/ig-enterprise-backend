import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { PassportModule } from '@nestjs/passport';
import { jwtConstants } from './auth.constants';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';
import { SettingModule } from '../setting/setting.module';

@Module({
    imports: [UsersModule, SettingModule, PassportModule.register({ defaultStrategy: 'jwt' }), JwtModule.register({
        secret: jwtConstants.secret,
        signOptions: { expiresIn: '365d' },
    }),],
    providers: [AuthService, JwtStrategy],
    exports: [AuthService],
    controllers: [AuthController],
})
export class AuthModule { }