import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from "typeorm";

@Entity()
export class Followers {
  @PrimaryGeneratedColumn()
  id: string;
  @Column()
  date: string;
  @Column()
  followers: number;
  @Column()
  female: number;
  @Column()
  male: number;
  @Column()
  nonBinary: number;
  @Column()
  aLevelAge: number;
  @Column()
  bLevelAge: number;
  @Column()
  cLevelAge: number;
  @Column()
  dLevelAge: number;
  @Column()
  eLevelAge: number;
  @Column()
  fLevelAge: number;
  @Column()
  gLevelAge: number;
  @Column()
  hLevelAge: number;
  @Column()
  iLevelAge: number;
  @Column()
  jLevelAge: number;
  @Column()
  kLevelAge: number;
  @Column()
  lLevelAge: number;
  @Column()
  mLevelAge: number;
  @Column()
  nLevelAge: number;
  @Column()
  oLevelAge: number;
  @Column()
  pLevelAge: number;
  @Column()
  qLevelAge: number;
  @Column()
  firstTopLocation: string;
  @Column()
  first: number;
  @Column()
  secondTopLocation: string;
  @Column()
  second: number;
  @Column()
  thirdTopLocation: string;
  @Column()
  third: number;
  @Column()
  fourthTopLocation: string;
  @Column()
  fourth: number;
  @Column()
  fifthTopLocation: string;
  @Column()
  fifth: number;
}