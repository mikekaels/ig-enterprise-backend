import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({name: 'interest_user_user'})
export class UserInterest {
  @PrimaryGeneratedColumn({name: 'id'})
  id: number;

  @Column()
  userId: number;

  @Column()
  interestId: number;

  @Column('timestamp', { name: 'created_at', default: () => "CURRENT_TIMESTAMP"})
  createdAt: Date;

  @Column('timestamp', { name: 'updated_at', default: () => "CURRENT_TIMESTAMP"})
  updatedAt: Date;

}