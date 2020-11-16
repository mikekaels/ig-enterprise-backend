import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Follow, FollowStatus } from '../shared/entity/follow.entity';
import { Repository, FindConditions, getRepository, Like, Not } from 'typeorm';
import { FollowDto } from './dto/follow.dto';
import { User } from '../shared/entity/users.entity';
import * as moment from 'moment';
import { Favourite } from '../shared/entity/favourite.entity';
import { FavouriteDto } from './dto/favourite.dto';
import { Post } from '../shared/entity/post.entity';

@Injectable()
export class FollowService {

    constructor(
        @InjectRepository(Follow)
        private readonly followRepository: Repository<Follow>,
        @InjectRepository(Favourite)
        private readonly favouriteRepository: Repository<Favourite>,
    ) { }

    async save(followDto: FollowDto, user: User, follower: User, following: User): Promise<any> {
        try {
            let follow = new Follow();
            follow.createdAt = followDto.createdAt == null ? new Date() : moment(followDto.createdAt).toDate();
            follow.follower = follower;
            follow.following = following;
            follow.favourite = followDto.favourite == null ? false : followDto.favourite;
            follow.status = follower.accountType == 'P' ? FollowStatus.ACTIVE : FollowStatus.PENDING;
            follow.updatedAt = followDto.updatedAt == null ? new Date() : moment(followDto.updatedAt).toDate();
            follow = await this.followRepository.save(follow);
            const status = follower.accountType == 'P' ? 'UNFOLLOW' : 'REQUESTED';
            return { status: "success", follow_status: status, id: follow.id };
        } catch (err) {
            return { message: "save follow fail, please try again" };
        }
    }

    async update(followDto: FollowDto): Promise<any> {
        try {
            const follow = new Follow();
            follow.id = followDto.id;
            follow.status = FollowStatus[followDto.status];
            follow.updatedAt = followDto.updatedAt == null ? new Date() : moment(followDto.updatedAt).toDate();
            await this.followRepository.update(follow.id, { status: follow.status, updatedAt: follow.updatedAt });
            return { status: "success", follow_status: follow.status };
        } catch (err) {
            return { message: "update fail, please try again" };
        }

    }

    async delete(id: number): Promise<any> {
        try {
            await this.followRepository.delete(id);
            return { status: "success" };
        } catch (err) {
            return { message: "unfollow fail, please try again" };
        }
    }

    async deleteUID(follower: User, following: User): Promise<any> {
        try {
            await this.followRepository.delete({ follower: follower, following: following });
            return { status: "success" };
        } catch (err) {
            return { message: "unfollow fail, please try again" };
        }
    }

    async remove(id: number): Promise<any> {
        try {
            await this.followRepository.delete(id);
            return { status: "success" };
        } catch (err) {
            return { message: "remove follower fail, please try again" };
        }
    }

    async block(id: number): Promise<any> {
        try {
            await this.followRepository.update(id, { status: FollowStatus.BLOCK, updatedAt: new Date() });
            return { status: "success" };
        } catch (err) {
            return { message: "block follower fail, please try again" };
        }
    }

    async updateFav(followDto: FollowDto): Promise<any> {
        try {
            const follow = new Follow();
            follow.id = followDto.id;
            follow.favourite = followDto.favourite;
            follow.updatedAt = followDto.updatedAt == null ? new Date() : moment(followDto.updatedAt).toDate();
            await this.followRepository.update(follow.id, { favourite: follow.favourite, updatedAt: follow.updatedAt });
            return { status: "success" };
        } catch (err) {
            return { message: "update follow fail, please try again" };
        }
    }

    async removeFav(id: number): Promise<any> {
        try {
            await this.favouriteRepository.delete(id);
            return { status: "success" };
        } catch (err) {
            return { message: "remove favourite fail, please try again" };
        }
    }

    async findAllFollow(id: number): Promise<Follow[]> {
        return await getRepository(Follow)
            .createQueryBuilder("follow")
            .leftJoinAndSelect("follow.follower", "user")
            .leftJoinAndSelect("follow.following", "user")
            .where("user.id = :id", { id: id })
            .getMany();
    }


    async findFollower(id: number): Promise<Follow[]> {
        const followers = await this.followRepository.find({
            where: { followerId: id, status: 'A' },
            relations: ['following'],
            order: { updatedAt: 'DESC' },
            take: 30
        });
        return followers;
    }

    async findOtherFollower(id: number): Promise<Follow[]> {
        const followers = await this.followRepository.find({
            where: { followerId: id, status: Not('B')},
            relations: ['following'],
            order: { updatedAt: 'DESC' },
            take: 30
        });
        return followers;
    }

    async findFollowing(id: number): Promise<Follow[]> {
        const followings = await this.followRepository.find({
            where: { followingId: id, status: 'A' },
            relations: ['follower'],
            order: { updatedAt: 'DESC' },
            take: 30
        });
        return followings;
    }

    // current login user take all following regardless status
    async findOtherFollowing(id: number): Promise<Follow[]> {
        const followings = await this.followRepository.find({
            where: { followingId: id, status: Not('B') },
            relations: ['follower'],
            order: { updatedAt: 'DESC' },
            take: 30
        });
        return followings;
        // return await getRepository(Follow)
        //     .createQueryBuilder("follow")
        //     .leftJoinAndSelect("follow.follower", "follower")
        //     .where("follower.id IN (:...id)", { id: [id, uid] })
        //     .andWhere("follow.status = 'A'")
        //     .orderBy("follow.updatedAt", "DESC")
        //     .take(30)
        //     .getMany();
    }

    async searchFollowing(id: number, search: string): Promise<Follow[]> {
        const searchPattern = "%" + search + "%";
        const followings = await this.followRepository.find({
            join: { alias: 'follow', leftJoinAndSelect: { user: 'follow.follower' } },
            where: qb => {
                qb.where({
                    status: 'A',
                    followingId: id
                }).andWhere('user.username like :username', { username: searchPattern }); // Filter related field
            },
            order: { updatedAt: 'DESC' },
            take: 10
        });
        return followings;
    }

    async searchFollowFollowing(id: number, search: string): Promise<Follow[]> {
        const searchPattern = "%" + search + "%";
        const followings = await this.followRepository.find({
            join: { alias: 'follow', leftJoinAndSelect: { user: 'follow.follower' } },
            where: qb => {
                qb.where({
                    status: Not('B'),
                    followingId: id
                }).andWhere('user.username like :username', { username: searchPattern }); // Filter related field
            },
            order: { updatedAt: 'DESC' },
            take: 10
        });
        return followings;
    }

    async searchFollower(id: number, search: string): Promise<Follow[]> {
        const searchPattern = "%" + search + "%";
        const followers = await this.followRepository.find({
            join: { alias: 'follow', leftJoinAndSelect: { user: 'follow.following' } },
            where: qb => {
                qb.where({
                    status: 'A',
                    followerId: id
                }).andWhere('user.username like :username', { username: searchPattern }); // Filter related field
            },
            order: { updatedAt: 'DESC' },
            take: 10
        });
        return followers;
    }

    async searchFollowFollower(id: number, search: string): Promise<Follow[]> {
        const searchPattern = "%" + search + "%";
        const followers = await this.followRepository.find({
            join: { alias: 'follow', leftJoinAndSelect: { user: 'follow.following' } },
            where: qb => {
                qb.where({
                    status: Not('B'),
                    followerId: id
                }).andWhere('user.username like :username', { username: searchPattern }); // Filter related field
            },
            order: { updatedAt: 'DESC' },
            take: 10
        });
        return followers;
    }

    async searchRequests(id: number, search: string): Promise<Follow[]> {
        const searchPattern = "%" + search + "%";
        const followers = await this.followRepository.find({
            join: { alias: 'follow', leftJoinAndSelect: { user: 'follow.following' } },
            where: qb => {
                qb.where({
                    status: 'P',
                    followerId: id
                }).andWhere('user.username like :username', { username: searchPattern }); // Filter related field
            },
            order: { updatedAt: 'DESC' },
        });
        return followers;
    }

    async findRequests(id: number): Promise<Follow[]> {
        const followers = await this.followRepository.find({
            where: { followerId: id, status: 'P' },
            relations: ['following'],
            order: { updatedAt: 'DESC' }
        });
        return followers;
    }

    async findFollowingPost(id: number): Promise<any> {
        return await this.followRepository.find({
            where: { followingId: id, status: 'A' },
            relations: ['follower', 'follower.posts'],
            order: { createdAt: 'DESC' }
        });
    }

    async findBlocked(id: number): Promise<Follow[]> {
        const followers = await this.followRepository.find({
            where: { followerId: id, status: 'B' },
            relations: ['following'],
            order: { updatedAt: 'DESC' }
        });
        return followers;
    }


}
