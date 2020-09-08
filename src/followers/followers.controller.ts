import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { FollowersService } from './followers.service';
import { PaginationDTO } from './dto/Pagination.dto';
import { PaginatedFollowersResultDto } from './dto/PaginatedFollowersResult.dto';

@Controller('followers')
export class FollowersController {
  constructor(public followersService: FollowersService) { }

  @Get()
  async getFollowers(@Query() paginationDto: PaginationDTO): Promise<PaginatedFollowersResultDto> {

    paginationDto.page = Number(paginationDto.page);
    paginationDto.limit = 10;

    return this.followersService.getAllFollowers({
      ...paginationDto,
      limit: paginationDto.limit > 10 ? 10 : paginationDto.limit
    });
  }

  @Post()
  async createFollowersData(@Body() body): Promise<any> {
    return this.followersService.createFollowers(body);
  }
}
