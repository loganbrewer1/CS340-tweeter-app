import {
  Status,
  PagedStatusItemRequest,
  PostStatusRequest,
} from "tweeter-shared";
import { ServerFacade } from "../network/ServerFacade";

export class StatusService {
  private serverFacade = new ServerFacade();

  public async loadMoreFeedItems(
    requestObject: PagedStatusItemRequest
  ): Promise<[Status[], boolean]> {
    return this.serverFacade.getMoreFeedItems(requestObject);
  }

  public async loadMoreStoryItems(
    requestObject: PagedStatusItemRequest
  ): Promise<[Status[], boolean]> {
    return this.serverFacade.getMoreStoryItems(requestObject);
  }

  public async postStatus(requestObject: PostStatusRequest): Promise<void> {
    return this.serverFacade.postStatus(requestObject);
  }
}

export default StatusService;
