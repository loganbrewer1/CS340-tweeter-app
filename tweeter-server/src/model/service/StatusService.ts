import { Status, StatusDto } from "tweeter-shared";
import { FeedDynamoDAO } from "../dao/dynamodb/FeedDynamoDAO";
import { StoryDynamoDAO } from "../dao/dynamodb/StoryDynamoDAO";
import { AuthTokenDynamoDAO } from "../dao/dynamodb/AuthTokenDynamoDAO";

export class StatusService {
  private feedDAO: FeedDynamoDAO;
  private storyDAO: StoryDynamoDAO;
  private authTokenDAO: AuthTokenDynamoDAO;

  constructor() {
    this.feedDAO = new FeedDynamoDAO();
    this.storyDAO = new StoryDynamoDAO();
    this.authTokenDAO = new AuthTokenDynamoDAO();
  }

  private async checkAuthTokenValidity(token: string): Promise<void> {
    const isValid = await this.authTokenDAO.doesAuthTokenExist(token);
    if (!isValid) {
      throw new Error("Invalid authentication token.");
    }
  }

  public async loadMoreFeedItems(
    token: string,
    userAlias: string,
    pageSize: number,
    lastItem: StatusDto | null
  ): Promise<[StatusDto[], boolean]> {
    this.checkAuthTokenValidity(token)
    const lastItemTimestamp = lastItem ? lastItem.timestamp : undefined;

    const [feedItems, hasMorePages] = await this.feedDAO.getFeedForUser(
      userAlias,
      lastItemTimestamp,
      pageSize
    );

    return [feedItems, hasMorePages];
  }

  public async loadMoreStoryItems(
    token: string,
    userAlias: string,
    pageSize: number,
    lastItem: StatusDto | null
  ): Promise<[StatusDto[], boolean]> {
    this.checkAuthTokenValidity(token);

    const lastItemTimestamp = lastItem ? lastItem.timestamp : undefined;

    const [storyItems, hasMorePages] = await this.storyDAO.getUserStories(
      userAlias,
      lastItemTimestamp,
      pageSize
    );

    return [storyItems, hasMorePages];
  }

  public async postStatus(
    token: string,
    newStatus: StatusDto | null
  ): Promise<void> {
    this.checkAuthTokenValidity(token);

    if (!newStatus) {
      throw new Error("Status cannot be null.");
    }

    await this.feedDAO.addStatusToFeeds(newStatus.user.alias, newStatus);
    await this.storyDAO.addStory(newStatus.user.alias, newStatus);
  }
}

export default StatusService;
