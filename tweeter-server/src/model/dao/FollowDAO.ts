export interface FollowDAO {
  followUser(followerAlias: string, followeeAlias: string): Promise<void>;
  unfollowUser(followerAlias: string, followeeAlias: string): Promise<void>;
  getFollowers(followeeAlias: string): Promise<string[]>;
  getFollowees(followerAlias: string): Promise<string[]>;
}
