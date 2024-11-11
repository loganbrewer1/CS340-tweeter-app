import { AuthToken, Status, FakeData, PagedStatusItemRequest } from "tweeter-shared";
import { ServerFacade } from "../network/ServerFacade";

export class StatusService {
  private serverFacade = new ServerFacade();

  public async loadMoreFeedItems(
    requestObject: PagedStatusItemRequest
  ): Promise<[Status[], boolean]> {
    // TODO: Replace with the result of calling server
    return this.serverFacade.getMoreFeedItems(requestObject);
  }

  public async loadMoreStoryItems(
    requestObject: PagedStatusItemRequest
  ): Promise<[Status[], boolean]> {
    // TODO: Replace with the result of calling server
    return this.serverFacade.getMoreStoryItems(requestObject);
  }

  public async postStatus(
    authToken: AuthToken,
    newStatus: Status
  ): Promise<void> {
    // Pause so we can see the logging out message. Remove when connected to the server
    await new Promise((f) => setTimeout(f, 2000));

    // TODO: Call the server to post the status
  }
}

export default StatusService;