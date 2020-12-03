import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({name: 'interest_advert_advert'})
export class AdvertInterest {
  @PrimaryGeneratedColumn({name: 'id'})
  id: number;

  @Column()
  advertId: number;

  @Column()
  interestId: number;

  @Column('timestamp', { name: 'created_at', default: () => "CURRENT_TIMESTAMP"})
  createdAt: Date;

  @Column('timestamp', { name: 'updated_at', default: () => "CURRENT_TIMESTAMP"})
  updatedAt: Date;

}