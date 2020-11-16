import { Entity, Column, PrimaryGeneratedColumn, ManyToMany, JoinTable } from 'typeorm';
import { Post } from './post.entity';
import { ReportPost } from './report_post.entity';

@Entity({name: 'report'})
export class Report {
  @PrimaryGeneratedColumn({name: 'id'})
  id: number;

  @Column({name: 'name'})
  name: string;

  @Column('timestamp', { name: 'created_at', default: () => "CURRENT_TIMESTAMP" })
  createdAt: Date;

  @ManyToMany(type => Post, post => post.report)
  @JoinTable()
  post: Post[];

}