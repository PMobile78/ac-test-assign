import {Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {TokenController} from './token.controller';
import {TokenService} from './token.service';
import {User} from "../users/user.entity";
import {Token} from "./token.entity";

@Module({
    imports: [TypeOrmModule.forFeature([User, Token])],
    providers: [TokenService],
    controllers: [TokenController],
})
export class TokenModule {
}
