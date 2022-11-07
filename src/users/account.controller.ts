import {
    Controller,
    Get, Query,
} from '@nestjs/common';
import {UsersService} from './users.service';
import {TokenService} from '../token/token.service';
import {User} from "./user.entity";

@Controller('account')
export class AccountController {
    constructor(private readonly usersService: UsersService, private readonly tokenService: TokenService) {
    }

    @Get()
    async findOne(@Query() token: { token: string }): Promise<User> {
        let result = await this.tokenService.checkToken(token.token)
        return await this.usersService.findUserByToken(result.user_id);
    }
}
