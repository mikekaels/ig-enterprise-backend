import { Followers } from '../followers.entity';

export class PaginatedFollowersResultDto {
  data: Followers[];
  currentPage: number;
  limit: number;
  totalPage: number;
  totalCount: number;
}