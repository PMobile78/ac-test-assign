import {HttpException, HttpStatus, Injectable, Logger} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {User} from "../users/user.entity";
import {Token} from "./token.entity";
import * as bcrypt from "bcrypt";

const jwt = require('jsonwebtoken')
const {v4: uuidv4} = require('uuid')

@Injectable()
export class TokenService {
    private readonly logger = new Logger(TokenService.name);

    constructor(
        @InjectRepository(User)
        private readonly usersRepository: Repository<User>,
        @InjectRepository(Token)
        private readonly tokenRepository: Repository<Token>,
    ) {
    }

    async createToken(user: User): Promise<string> {
        const secret = process.env.TOKEN_SECRET;
        const uuid = uuidv4();
        const token = jwt.sign(
            {},
            secret,
            {
                expiresIn: process.env.EXPIRE_TOKEN,
                jwtid: uuid,
                algorithm: 'HS512'
            }
        );
        await this.saveToken(user.id, uuid);
        return token
    }

    async checkUser(email, password): Promise<User> {
        let user = await this.usersRepository.findOneBy({email: email});
        let isMatched = await bcrypt.compare(password, user.password_hash);
        if (!isMatched) {
            throw new HttpException('Wrong Login or Password.', HttpStatus.UNAUTHORIZED);
        }
        return user;
    }

    async saveToken(userId, uuid): Promise<Token> {
        const token = new Token();
        token.uuid = uuid;
        token.user_id = userId;
        token.date = Math.floor(Date.now() / 1000);
        return this.tokenRepository.save(token);
    }

    async decode(token, ignoreExpiration = false) {
        try {
            let secret = process.env.TOKEN_SECRET;
            return jwt.verify(
                token,
                secret,
                {
                    ignoreExpiration: ignoreExpiration,
                    algorithms: ['HS512']
                }
            );
        } catch (error) {
            this.logger.error('Token can\'t be decoded', error)
            throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);
        }
    }

    async checkToken(tokenForValidation) {
        let decoded = await this.decode(tokenForValidation)
        try {
            let token = await this.tokenRepository.findOneBy({uuid: decoded.jti})
            if (!token.is_valid) {
                throw new HttpException('Token was expired', HttpStatus.UNAUTHORIZED)
            }
            return token
        } catch (error) {
            this.logger.error('Token can\'t be found in db')
            throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);
        }
    }
}
