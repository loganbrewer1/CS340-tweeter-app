import { UserDto } from "tweeter-shared";

export interface FollowDAO {
  followUser(followerAlias: string, followeeAlias: string): Promise<void>;
  unfollowUser(followerAlias: string, followeeAlias: string): Promise<void>;
  getFollowers(
    followeeAlias: string,
    limit: number,
    exclusiveStartKey?: string
  ): Promise<{ users: UserDto[]; hasMore: boolean }>;
  getFollowerCount(followeeAlias: string): Promise<number>;
  getFollowees(
    followerAlias: string,
    limit: number,
    exclusiveStartKey?: string
  ): Promise<{ followees: UserDto[]; hasMore: boolean }>;
  getFolloweeCount(followerAlias: string): Promise<number>;
  isFollower(followerAlias: string, followeeAlias: string): Promise<boolean>;
}
