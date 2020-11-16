import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, ManyToMany } from 'typeorm';
import { User } from './users.entity';
import { HashTag } from './hashtag.entity';
import { Interest } from './interest.entity';
import { BookMark } from './bookmark.entity';
import { Share } from './share.entity';
import { Report } from './report.entity';
import { Advert } from './advert.entity';

export enum Status {
  PENDING = 'P',
  ACTIVE = 'A',
  REJECT = 'R',
  BLOCK = 'B',
  DELETE = 'D',
}

@Entity()
export class Post{
  @PrimaryGeneratedColumn({name: 'id'})
  id: number;

  @ManyToOne(type => User, user => user.posts)
  user: User;

  @Column({name: 'content'})
  content: string;

  @Column({name: 'imageURL200x200'})
  imageURL200x200: string;

  @Column({name: 'imageURL600x600'})
  imageURL600x600: string;

  @Column({name: 'imageURL1080x1080'})
  imageURL1080x1080: string;

  @Column({name: 'promotion'})
  promotion: boolean;

  @Column({name: 'editedImage'})
  editedImage: boolean;

  @Column({name: 'status'})
  status: string;

  @Column('timestamp', { name: 'created_at', default: () => "CURRENT_TIMESTAMP"})
  createdAt: Date;

  @Column('timestamp', { name: 'updated_at', default: () => "CURRENT_TIMESTAMP"})
  updatedAt: Date;

  @ManyToMany(type => HashTag, hashTag => hashTag.post)
  hashTag: HashTag[];

  @ManyToMany(type => User, user => user.post)
  userTag: User[];

  @ManyToMany(type => Interest, interest => interest.postInterestTag)
  interestTag: Interest[];

  @ManyToMany(type => BookMark, book => book.bookMark)
  bookMark: BookMark[];

  @ManyToMany(type => Share, share => share.post)
  share: Share[];

  @ManyToMany(type => Report, report => report.post)
  report: Report[];

  @ManyToOne(type => Advert, advert => advert.post)
  advert: Advert;

}