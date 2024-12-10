import { UserDto } from "tweeter-shared";

export interface FollowDAO {
  followUser(followerAlias: string, followeeAlias: string): Promise<void>;
  unfollowUser(followerAlias: string, followeeAlias: string): Promise<void>;
  getFollowers(followeeAlias: string): Promise<UserDto[]>;
  getFollowerCount(followeeAlias: string): Promise<number>;
  getFollowees(followerAlias: string): Promise<UserDto[]>;
  getFolloweeCount(followerAlias: string): Promise<number>;
}
