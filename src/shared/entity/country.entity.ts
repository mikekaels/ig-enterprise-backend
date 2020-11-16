import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Country {
  @PrimaryGeneratedColumn({name: 'id'})
  id: number;

  @Column({name: 'code'})
  code: string;

  @Column({name: 'name'})
  name: string;

}