import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn, OneToMany, RelationCount, JoinTable, ManyToMany, ManyToOne } from 'typeorm';
import { City } from './city.entity';
import { Gender } from './gender.entity';
import { Interest } from './interest.entity';
import { Post } from './post.entity';
import { User } from './users.entity';

export enum Status {
    PENDING = 'P',
    ACTIVE = 'A',
    REJECT = 'R',
    BLOCK = 'B',
    DELETE = 'D',
  }

@Entity()
export class Advert {
  @PrimaryGeneratedColumn({ name: 'id' })
  id: number;

  @Column({ name: 'min_age' })
  minAge: number;

  @Column({ name: 'max_age' })
  maxAge: number;

  @Column({ name: 'timezone' })
  timezone: string;

  @Column('timestamp', { name: 'from_time', default: () => "CURRENT_TIMESTAMP" })
  fromTime: Date;

  @Column('timestamp', { name: 'to_time', default: () => "CURRENT_TIMESTAMP" })
  toTime: Date;

  @Column({ name: 'placement' })
  placement: string;

  @Column({ name: 'budget' })
  budget: number;

  @Column({ name: 'status' })
  status: Status;

  @Column('timestamp', { name: 'created_at', default: () => "CURRENT_TIMESTAMP" })
  createdAt: Date;

  @Column('timestamp', { name: 'updated_at', default: () => "CURRENT_TIMESTAMP" })
  updatedAt: Date;

  @OneToOne(type => User, user => user.advert)
  user: User;

  @OneToOne(type => Post, post => post.advert)
  post: Post;

  @OneToOne(type => Gender, gender => gender.user, { eager: true })
  @JoinColumn({ name: 'gender_id' })
  gender: Gender;

  @ManyToMany(type => Interest, interest => interest.user, { eager: true })
  interest: Interest[];

  @OneToMany(type => City, city => city.user, { eager: true })
  @JoinColumn({ name: 'location_id' })
  city: City;
}