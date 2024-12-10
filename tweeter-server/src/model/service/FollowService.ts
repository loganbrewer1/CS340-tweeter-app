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
      return userAlias;
    }
  }

  public async getIsFollowerStatus(
    token: string,
    user: UserDto,
    selectedUser: UserDto
  ): Promise<boolean> {
    await this.checkAuthTokenValidity(token);

    return await this.followDAO.isFollower(user.alias, selectedUser.alias);
  }

  public async getFolloweeCount(token: string, user: string): Promise<number> {
    await this.checkAuthTokenValidity(token);

    return await this.followDAO.getFolloweeCount(user);
  }

  public async getFollowerCount(token: string, user: string): Promise<number> {
    console.log("Check auth token validity...");
    await this.checkAuthTokenValidity(token);

    return await this.followDAO.getFollowerCount(user);
  }

  public async follow(
    token: string,
    userToFollow: UserDto
  ): Promise<[followerCount: number, followeeCount: number]> {
    const currentUser = await this.checkAuthTokenValidity(token);

    await this.followDAO.followUser(currentUser, userToFollow.alias);

    const followerCount = await this.getFollowerCount(
      token,
      userToFollow.alias
    );
    const followeeCount = await this.getFolloweeCount(
      token,
      userToFollow.alias
    );

    return [followerCount, followeeCount];
  }

  public async unfollow(
    token: string,
    userToUnfollow: UserDto
  ): Promise<[followerCount: number, followeeCount: number]> {
    const currentUser = await this.checkAuthTokenValidity(token);

    await this.followDAO.unfollowUser(currentUser, userToUnfollow.alias);

    const followerCount = await this.getFollowerCount(
      token,
      userToUnfollow.alias
    );
    const followeeCount = await this.getFolloweeCount(
      token,
      userToUnfollow.alias
    );

    return [followerCount, followeeCount];
  }

  public async loadMoreFollowers(
    token: string,
    userAlias: string,
    pageSize: number,
    lastItem: UserDto | null
  ): Promise<[UserDto[], boolean]> {
    await this.checkAuthTokenValidity(token);

    const lastEvaluatedKey = lastItem ? lastItem.alias : undefined;
    const result = await this.followDAO.getFollowers(
      userAlias,
      pageSize,
      lastEvaluatedKey
    );

    return [result.users, result.hasMore];
  }

  public async loadMoreFollowees(
    token: string,
    userAlias: string,
    pageSize: number,
    lastItem: UserDto | null
  ): Promise<[UserDto[], boolean]> {
    await this.checkAuthTokenValidity(token);

    const lastEvaluatedKey = lastItem ? lastItem.alias : undefined;
    const result = await this.followDAO.getFollowees(
      userAlias,
      pageSize,
      lastEvaluatedKey
    );

    return [result.followees, result.hasMore];
  }
}

export default FollowService;
