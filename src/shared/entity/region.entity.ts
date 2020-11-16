import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Region {
  @PrimaryGeneratedColumn({name: 'id'})
  id: number;

  @Column({name: 'code'})
  code: string;

  @Column({name: 'name'})
  name: string;

  @Column({name: 'country_id'})
  countryId: number;

}