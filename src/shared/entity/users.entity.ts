import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn, OneToMany, RelationCount, JoinTable, ManyToMany } from 'typeorm';
import { City } from './city.entity';
import { Gender } from './gender.entity';
import { Post } from './post.entity';
import { Follow } from './follow.entity';
import { Favourite } from './favourite.entity';
import { Interest } from './interest.entity';
import { Blocked } from './blocked.entity';
import { Advert } from './advert.entity';

export enum UserStatus {
  PENDING = 'P',
  ACTIVE = 'A',
  INACTIVE = 'I',
  BLOCK = 'B',
}

export enum AccountType {
  PUBLIC = 'P',
  PRIVATE = 'V',
}

@Entity()
export class User {
  @PrimaryGeneratedColumn({ name: 'id' })
  id: number;

  @Column({ name: 'fuid' })
  fuid: string;

  @Column({ name: 'username' })
  username: string;

  @Column({  select: false, name: 'pass_hash' })
  passHash: string;

  @Column({ name: 'email' })
  email: string;

  @Column({ name: 'secondary_email' })
  secondaryEmail: string;

  @Column({ name: 'fullname' })
  fullname: string;

  @Column({ name: 'bio' })
  bio: string;

  @Column({ name: 'website' })
  website: string;

  @Column({ type: 'date', name: 'dob' })
  dob: Date;

  @OneToOne(type => Gender, gender => gender.user, { eager: true })
  @JoinColumn({ name: 'gender_id' })
  gender: Gender;

  @Column({ name: 'profile_image_url_200x200' })
  profileImageURL200X200: string;

  @Column({ name: 'profile_image_url_600x600' })
  profileImageURL600X600: string;

  @Column({ name: 'profile_image_url_1080x1080' })
  profileImageURL1080X1080: string;

  @OneToOne(type => City, city => city.user, { eager: true })
  @JoinColumn({ name: 'location_id' })
  city: City;

  @OneToMany(type => Post, post => post.user)
  posts: Post[];

  @OneToMany(type => Follow, follow => follow.follower)
  follower: Follow[];

  @OneToMany(type => Follow, follow => follow.following)
  following: Follow[];

  @RelationCount((user: User) => user.follower)
  followersCount: number;
  
  @RelationCount((user: User) => user.following)
  followingCount: number;
  
  @OneToMany(type => Favourite, fav => fav.user)
  user: Favourite[];

  @OneToMany(type => Favourite, fav => fav.favourite)
  favourite: Favourite[];

  @ManyToMany(type => Post, post => post.userTag)
  @JoinTable()
  post: Post[];

  @ManyToMany(type => Interest, interest => interest.user, { eager: true })
  interest: Interest[];

  @OneToMany(type => Blocked, blocked => blocked.user)
  blocked: Blocked[];
  
  @Column({ name: 'status' })
  status: UserStatus;

  @Column({ name: 'account_type' })
  accountType: AccountType;

  @Column({ name: 'tagged' })
  tagged: string;

  @Column({ name: 'replies', default: false })
  replies: boolean;

  @Column({ name: 'auto_save_post', default: false })
  autoSavePost: boolean;

  @Column({ name: 'new_message', default: false })
  newMessage: boolean;

  @Column({ name: 'new_follower_request', default: false })
  newFollowerRequest: boolean;

  @Column({ name: 'tagged_in_post', default: false })
  taggedInPost: boolean;

  @Column({ name: 'admin_email', default: false })
  adminEmail: boolean;

  @Column({ name: 'admin_push', default: false })
  adminPush: boolean;

  @Column({ name: 'public_account', default: true })
  publicAccount: boolean;

  @Column({ name: 'private_account', default: false })
  privateAccount: boolean;

  @Column({ name: 'enterprise_account', default: false })
  enterpriseAccount: boolean;

  @Column({ name: 'approve_account', default: false })
  approveAccount: boolean;

  @Column('timestamp', { name: 'created_at', default: () => "CURRENT_TIMESTAMP" })
  createdAt: Date;

  @Column('timestamp', { name: 'updated_at', default: () => "CURRENT_TIMESTAMP" })
  updatedAt: Date;

  @OneToMany(type => Advert, advert => advert.user)
  advert: Advert[];

  access_token: string;
}