import { Entity, Column, PrimaryGeneratedColumn, OneToOne } from 'typeorm';
import { User } from './users.entity';

@Entity()
export class Gender {
  @PrimaryGeneratedColumn({name: 'id'})
  id: number;

  @Column({name: 'name'})
  name: string;

  @OneToOne(type => User, user => user.gender)
  user: User;

}