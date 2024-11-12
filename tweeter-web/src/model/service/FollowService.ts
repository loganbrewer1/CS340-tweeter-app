import { AuthToken, User, FakeData, PagedUserItemRequest, FollowRelatedRequest } from "tweeter-shared";
import { ServerFacade } from "../network/ServerFacade";

export class FollowService {
  private serverFacade = new ServerFacade();

  public async getIsFollowerStatus(
    authToken: AuthToken,
    user: User,
    selectedUser: User
  ): Promise<boolean> {
    // TODO: Replace with the result of calling server
    return FakeData.instance.isFollower();
  }

  public async getFolloweeCount(
    requestObject: FollowRelatedRequest
  ): Promise<number> {
    return this.serverFacade.getFolloweeCount(requestObject);
  }

  public async getFollowerCount(
    requestObject: FollowRelatedRequest
  ): Promise<number> {
    return this.serverFacade.getFollowerCount(requestObject);
  }

  public async follow(
    requestObject: FollowRelatedRequest
  ): Promise<[followerCount: number, followeeCount: number]> {
    // Pause so we can see the follow message. Remove when connected to the server
    await new Promise((f) => setTimeout(f, 2000));

    // TODO: Call the server

    const followerCount = await this.getFollowerCount(requestObject);
    const followeeCount = await this.getFolloweeCount(requestObject);

    return [followerCount, followeeCount];
  }

  public async unfollow(
    requestObject: FollowRelatedRequest
  ): Promise<[followerCount: number, followeeCount: number]> {
    // Pause so we can see the unfollow message. Remove when connected to the server
    await new Promise((f) => setTimeout(f, 2000));

    // TODO: Call the server

    const followerCount = await this.getFollowerCount(requestObject);
    const followeeCount = await this.getFolloweeCount(requestObject);

    return [followerCount, followeeCount];
  }

  public async loadMoreFollowers(
    requestObject: PagedUserItemRequest
  ): Promise<[User[], boolean]> {
    // TODO: Replace with the result of calling server
    return this.serverFacade.getMoreFollowers(requestObject);
  }

  public async loadMoreFollowees(
    requestObject: PagedUserItemRequest
  ): Promise<[User[], boolean]> {
    // TODO: Replace with the result of calling server
    return this.serverFacade.getMoreFollowees(requestObject);
  }
}

export default FollowService;

//Login and register factoring and then move things to follow service
