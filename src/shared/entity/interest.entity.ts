import { Entity, Column, PrimaryGeneratedColumn, ManyToMany, JoinTable } from 'typeorm';
import { Post } from './post.entity';
import { User } from './users.entity';

@Entity()
export class Interest {
  @PrimaryGeneratedColumn({name: 'id'})
  id: number;

  @Column({name: 'name'})
  name: string;

  @Column({name: 'created_at'})
  createdAt: Date;

  @ManyToMany(type => Post, post => post.interestTag)
  @JoinTable()
  postInterestTag: Post[];

  @ManyToMany(type => User, user => user.interest)
  @JoinTable()
  user: Interest[];

}