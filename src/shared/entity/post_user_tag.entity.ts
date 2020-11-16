import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({name: 'user_post_post'})
export class PostUserTag {
  @PrimaryGeneratedColumn({name: 'id'})
  id: number;

  @Column()
  postId: number;

  @Column()
  userId: number;

  @Column({ name: 'tagged_status' })
  taggedStatus: string;

  @Column('timestamp', { name: 'created_at', default: () => "CURRENT_TIMESTAMP"})
  createdAt: Date;

}