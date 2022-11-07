import {Column, Entity, PrimaryGeneratedColumn} from 'typeorm';

@Entity()
export class Token {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    uuid: string;

    @Column()
    user_id: number;

    @Column({default: true})
    is_valid: boolean;
}
