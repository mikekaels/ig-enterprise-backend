import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { User } from './users.entity';

@Entity()
export class Favourite {
    @PrimaryGeneratedColumn({ name: 'id' })
    id: number;

    @ManyToOne(type => User, user => user.user)
    user: User;

    @ManyToOne(type => User, user => user.favourite)
    favourite: User;

    @Column('timestamp', { name: 'created_at', default: () => "CURRENT_TIMESTAMP" })
    createdAt: Date;

    @Column('timestamp', { name: 'updated_at', default: () => "CURRENT_TIMESTAMP" })
    updatedAt: Date;
}