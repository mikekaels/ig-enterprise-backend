import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Followers } from './followers.entity';
import { Repository } from 'typeorm';
import { PaginationDTO } from './dto/Pagination.dto';
import { PaginatedFollowersResultDto } from './dto/PaginatedFollowersResult.dto';

@Injectable()
export class FollowersService {
  constructor(
    @InjectRepository(Followers)
    public followersRepository: Repository<Followers>
  ) { }

  async getAllFollowers(paginationDto: PaginationDTO): Promise<PaginatedFollowersResultDto> {

    const skippedItems = (paginationDto.page - 1) * paginationDto.limit;

    const totalCount = await this.followersRepository.count();

    const totalPage = Math.ceil(totalCount / paginationDto.limit);

    const followers = await this.followersRepository.createQueryBuilder()
      .orderBy('date', "DESC")
      .offset(skippedItems)
      .limit(paginationDto.limit)
      .getMany();

    return {
      totalCount,
      currentPage: paginationDto.page,
      totalPage: totalPage,
      limit: paginationDto.limit,
      data: followers
    };
  }

  async createFollowers(data): Promise<any> {
    const newFollowersData = await this.followersRepository.create(data);
    await this.followersRepository.save(newFollowersData);
    return newFollowersData;
  }
}
