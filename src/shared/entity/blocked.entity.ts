import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { User } from './users.entity';

@Entity()
export class Blocked {
  @PrimaryGeneratedColumn({name: 'id'})
  id: number;

  @ManyToOne(type => User, user => user.blocked)
  user: User;

  @Column()
  userId: number;

  @Column('timestamp', { name: 'created_at', default: () => "CURRENT_TIMESTAMP" })
  createdAt: Date;


}