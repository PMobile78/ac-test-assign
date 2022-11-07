import {
    Body,
    Controller,
    Post,
} from '@nestjs/common';
import {CreateTokenDto} from './dto/create-token.dto';
import {TokenService} from './token.service';


@Controller('token')
export class TokenController {
    constructor(private readonly tokenService: TokenService) {
    }

    @Post()
    async createToken(@Body() createTokenDto: CreateTokenDto): Promise<string> {
        let user = await this.tokenService.checkUser(createTokenDto.email, createTokenDto.password);
        return this.tokenService.createToken(user);
    }
}
