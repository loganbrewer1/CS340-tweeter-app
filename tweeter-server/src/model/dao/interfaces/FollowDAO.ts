import { UserDto } from "tweeter-shared";

export interface FollowDAO {
  followUser(followerAlias: string, followeeAlias: string): Promise<void>;
  unfollowUser(followerAlias: string, followeeAlias: string): Promise<void>;
  getFollowers(followeeAlias: string): Promise<UserDto[]>;
  getFollowees(followerAlias: string): Promise<UserDto[]>;
}
