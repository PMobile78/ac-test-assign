import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    ParseIntPipe, Put, Query,
} from '@nestjs/common';
import {UpdateUserDto, CreateUserDto, GetUsersDto} from './dto/user.dto';
import {User} from './user.entity';
import {UsersService} from './users.service';

@Controller('entities')
export class UsersController {
    constructor(private readonly usersService: UsersService) {
    }

    @Post()
    async create(@Body() createUserDto: CreateUserDto): Promise<User> {
        let user = await this.usersService.create(createUserDto);
        delete user.password_hash;
        return user;
    }

    @Put()
    async update(@Body() updateUserDto: UpdateUserDto): Promise<User> {
        let user = await this.usersService.update(updateUserDto);
        delete user.password_hash;
        return user;
    }

    @Get()
    findAll(@Query() getUsersDto: GetUsersDto): Promise<{ users: User[]; count: number; }> {
        return this.usersService.findAll(getUsersDto);
    }

    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number): Promise<User> {
        return this.usersService.findOne(id);
    }

    @Delete(':id')
    remove(@Param('id') id: number): Promise<void> {
        return this.usersService.remove(id);
    }
}
