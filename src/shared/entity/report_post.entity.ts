import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({name: 'report_post_post'})
export class ReportPost {
  @PrimaryGeneratedColumn({name: 'id'})
  id: number;

  @Column()
  postId: number;

  @Column()
  userId: number;

  @Column()
  reportId: number;

  @Column('timestamp', { name: 'created_at', default: () => "CURRENT_TIMESTAMP"})
  createdAt: Date;

}