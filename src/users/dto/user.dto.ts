import {IsInt, IsNumber, IsString} from 'class-validator';

export class CreateUserDto {
    firstName: string;
    lastName: string;
    password: string;
    email: string;
}

export class UpdateUserDto {
    id: number;
    firstName: string;
    lastName: string;
}

export class GetUsersDto {
    skip: number = 0;
    take: number = 25;
}