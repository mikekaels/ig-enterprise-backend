import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({name: 'interest_post_interest_tag_post'})
export class PostInterest {
  @PrimaryGeneratedColumn({name: 'id'})
  id: number;

  @Column()
  postId: number;

  @Column()
  interestId: number;

  @Column('timestamp', { name: 'created_at', default: () => "CURRENT_TIMESTAMP"})
  createdAt: Date;

}