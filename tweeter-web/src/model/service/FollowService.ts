import {
  User,
  PagedUserItemRequest,
  FollowRelatedRequest,
  IsFollowerRequest,
} from "tweeter-shared";
import { ServerFacade } from "../network/ServerFacade";

export class FollowService {
  private serverFacade = new ServerFacade();

  public async getIsFollowerStatus(
    requestObject: IsFollowerRequest
  ): Promise<boolean> {
    // TODO: Replace with the result of calling server
    return this.serverFacade.isFollowerStatus(requestObject);
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
    return this.serverFacade.follow(requestObject);
  }

  public async unfollow(
    requestObject: FollowRelatedRequest
  ): Promise<[followerCount: number, followeeCount: number]> {
    return this.serverFacade.unfollow(requestObject);
  }

  public async loadMoreFollowers(
    requestObject: PagedUserItemRequest
  ): Promise<[User[], boolean]> {
    return this.serverFacade.getMoreFollowers(requestObject);
  }

  public async loadMoreFollowees(
    requestObject: PagedUserItemRequest
  ): Promise<[User[], boolean]> {
    return this.serverFacade.getMoreFollowees(requestObject);
  }
}

export default FollowService;

//Login and register factoring and then move things to follow service
