import { Entity, Column, PrimaryGeneratedColumn, OneToOne } from 'typeorm';
import { User } from './users.entity';

@Entity()
export class City {
  @PrimaryGeneratedColumn({name: 'id'})
  id: number;

  @Column({name: 'code'})
  code: string;

  @Column({name: 'name'})
  name: string;

  @Column({name: 'region_id'})
  regionId: number;

  @OneToOne(type => User, user => user.city)
  user: User;

}