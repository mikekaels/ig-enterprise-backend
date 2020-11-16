import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable } from "typeorm";
import { Post } from "./post.entity";

@Entity()
export class HashTag {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    text: string;

    @Column('timestamp', { name: 'created_at', default: () => "CURRENT_TIMESTAMP" })
    createdAt: Date;

    @Column('timestamp', { name: 'updated_at', default: () => "CURRENT_TIMESTAMP" })
    updatedAt: Date;

    @ManyToMany(type => Post, post => post.hashTag)
    @JoinTable()
    post: Post[];

}