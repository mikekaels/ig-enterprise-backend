import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { User } from './users.entity';
import { Post } from './post.entity';

export enum FollowStatus {
    PENDING = 'P',
    ACTIVE = 'A',
    REJECT = 'R',
    BLOCK = 'B',
  }

@Entity()
export class Follow {
  @PrimaryGeneratedColumn({name: 'id'})
  id: number;

  @ManyToOne(type => User, user => user.follower)
  follower: User;

  @ManyToOne(type => User, user => user.following)
  following: User;

  @Column({name: 'followerId'})
  followerId: number;

  @Column({name: 'followingId'})
  followingId: number;

  @Column({name: 'status'})
  status: FollowStatus;

  @Column({name: 'favourite'})
  favourite: boolean;

  @Column('timestamp', { name: 'created_at', default: () => "CURRENT_TIMESTAMP" })
  createdAt: Date;

  @Column('timestamp', { name: 'updated_at', default: () => "CURRENT_TIMESTAMP" })
  updatedAt: Date;

  followStatus: string;

}