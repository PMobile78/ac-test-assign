import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {User} from './user.entity';
import {Token} from '../token/token.entity';
import * as bcrypt from 'bcrypt';
import {UpdateUserDto, CreateUserDto, GetUsersDto} from "./dto/user.dto";

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private readonly usersRepository: Repository<User>,
        @InjectRepository(Token)
        private readonly tokenRepository: Repository<Token>,
    ) {
    }

    async create(createUserDto: CreateUserDto): Promise<User> {
        const salt = await bcrypt.genSalt();
        let password = createUserDto.password;
        const hash = await bcrypt.hash(password, salt);
        const user = new User();
        user.firstName = createUserDto.firstName;
        user.lastName = createUserDto.lastName;
        user.password_hash = hash;
        user.email = createUserDto.email;
        try {
            return await this.usersRepository.save(user);
        } catch (error) {
            if(error.code === 'ER_DUP_ENTRY') {
                throw new HttpException('Duplicate email.', HttpStatus.BAD_REQUEST);
            }
            throw new HttpException('Something wrong.', HttpStatus.BAD_REQUEST);
        }
    }

    async update(updateUserDto: UpdateUserDto): Promise<User> {
        let user = await this.usersRepository.findOneBy({id: updateUserDto.id});
        if (!user) {
            throw new HttpException(`User ID ${updateUserDto.id} should exist before you can make any changes with it`, HttpStatus.NOT_FOUND);
        }
        user.firstName = updateUserDto.firstName
        user.lastName = updateUserDto.lastName
        return this.usersRepository.save(user)
    }

    async findAll(data: GetUsersDto): Promise<{ users: User[]; count: number; }> {
        let [result, total] = await this.usersRepository.findAndCount({
            select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                isActive: true,
            },
            take: data.take,
            skip: data.skip,
        });
        return {
            users: result,
            count: total
        }
    }

    findOne(id: number): Promise<User> {
        return this.usersRepository.findOne({
            select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                isActive: true,
            },
            where: {id: id},
        });
    }

    async remove(id: number): Promise<void> {
        await this.usersRepository.delete(id);
    }

    async findUserByToken(userId: number): Promise<User> {
        return this.usersRepository.findOne({
            select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                isActive: true,
            },
            where: {id: userId},
        });
    }
}
