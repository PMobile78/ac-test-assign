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
    skip: number;
    take: number;
}