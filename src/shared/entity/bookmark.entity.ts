import { Entity, Column, PrimaryGeneratedColumn, ManyToMany, JoinTable } from 'typeorm';
import { Post } from './post.entity';

@Entity()
export class BookMark {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  postId: number;

  @Column()
  userId: number;

  @Column('timestamp', { name: 'created_at', default: () => "CURRENT_TIMESTAMP" })
  createdAt: Date;

  @ManyToMany(type => Post, post => post.bookMark)
  @JoinTable()
  bookMark: Post[];
}