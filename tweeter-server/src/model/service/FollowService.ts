import { UserDto } from "tweeter-shared";
import { AuthTokenDAO } from "../dao/interfaces/AuthTokenDAO";
import { FollowDAO } from "../dao/interfaces/FollowDAO";

export class FollowService {
  private followDAO: FollowDAO;
  private authTokenDAO: AuthTokenDAO;

  constructor(followDAO: FollowDAO, authTokenDAO: AuthTokenDAO) {
    this.followDAO = followDAO;
    this.authTokenDAO = authTokenDAO;
  }

  private async checkAuthTokenValidity(token: string): Promise<string> {
    const userAlias = await this.authTokenDAO.doesAuthTokenExist(token);
    if (!userAlias) {
      throw new Error("Invalid authentication token.");
    } else {
      return userAlias
    }
  }

  public async getIsFollowerStatus(
    token: string,
    user: UserDto,
    selectedUser: UserDto
  ): Promise<boolean> {
    await this.checkAuthTokenValidity(token);

    const followers = await this.followDAO.getFollowers(selectedUser.alias);
    return followers.some((follower) => follower.alias === user.alias);
  }

  public async getFolloweeCount(token: string, user: string): Promise<number> {
    await this.checkAuthTokenValidity(token);

    const followees = await this.followDAO.getFollowees(user);
    return followees.length;
  }

  public async getFollowerCount(token: string, user: string): Promise<number> {
    console.log('Check auth token validity...')
    await this.checkAuthTokenValidity(token);

    const followers = await this.followDAO.getFollowers(user);
    return followers.length;
  }

  public async follow(
    token: string,
    userToFollow: UserDto
  ): Promise<[followerCount: number, followeeCount: number]> {
    const currentUser = await this.checkAuthTokenValidity(token);

    await this.followDAO.followUser(currentUser, userToFollow.alias);

    const followerCount = await this.getFollowerCount(token, userToFollow.alias);
    const followeeCount = await this.getFolloweeCount(token, userToFollow.alias);

    return [followerCount, followeeCount];
  }

  public async unfollow(
    token: string,
    userToUnfollow: UserDto
  ): Promise<[followerCount: number, followeeCount: number]> {
    const currentUser = await this.checkAuthTokenValidity(token);

    await this.followDAO.unfollowUser(currentUser, userToUnfollow.alias);

    const followerCount = await this.getFollowerCount(token, userToUnfollow.alias);
    const followeeCount = await this.getFolloweeCount(token, userToUnfollow.alias);

    return [followerCount, followeeCount];
  }

  public async loadMoreFollowers(
    token: string,
    userAlias: string,
    pageSize: number,
    lastItem: UserDto | null
  ): Promise<[UserDto[], boolean]> {
    await this.checkAuthTokenValidity(token);

    const allFollowers = await this.followDAO.getFollowers(userAlias);
    const startIndex = lastItem
      ? allFollowers.findIndex((user) => user.alias === lastItem.alias) + 1
      : 0;

    const paginatedFollowers = allFollowers.slice(
      startIndex,
      startIndex + pageSize
    );
    const hasMorePages = startIndex + pageSize < allFollowers.length;

    return [paginatedFollowers, hasMorePages];
  }

  public async loadMoreFollowees(
    token: string,
    userAlias: string,
    pageSize: number,
    lastItem: UserDto | null
  ): Promise<[UserDto[], boolean]> {
    await this.checkAuthTokenValidity(token);

    const allFollowees = await this.followDAO.getFollowees(userAlias);
    const startIndex = lastItem
      ? allFollowees.findIndex((user) => user.alias === lastItem.alias) + 1
      : 0;

    const paginatedFollowees = allFollowees.slice(
      startIndex,
      startIndex + pageSize
    );
    const hasMorePages = startIndex + pageSize < allFollowees.length;

    return [paginatedFollowees, hasMorePages];
  }
}

export default FollowService;
