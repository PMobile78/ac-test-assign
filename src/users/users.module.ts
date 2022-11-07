import {Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {User} from './user.entity';
import {Token} from '../token/token.entity';
import {UsersController} from './users.controller';
import {UsersService} from './users.service';
import {AccountController} from "./account.controller";
import {TokenService} from "../token/token.service";

@Module({
    imports: [TypeOrmModule.forFeature([User, Token])],
    providers: [UsersService, TokenService],
    controllers: [UsersController, AccountController],
})
export class UsersModule {
}
