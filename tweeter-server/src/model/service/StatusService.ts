import { StatusDto } from "tweeter-shared";
import { AuthTokenDAO } from "../dao/interfaces/AuthTokenDAO";
import { FeedDAO } from "../dao/interfaces/FeedDAO";
import { StoryDAO } from "../dao/interfaces/StoryDAO";
import { SQSClient, SendMessageCommand } from "@aws-sdk/client-sqs";

export class StatusService {
  private sqsClient = new SQSClient();
  private feedDAO: FeedDAO;
  private storyDAO: StoryDAO;
  private authTokenDAO: AuthTokenDAO;
  private statusFanOutQueueUrl =
    "https://sqs.us-west-2.amazonaws.com/011528258727/statusFanOutQueue";

  constructor(
    feedDAO: FeedDAO,
    storyDAO: StoryDAO,
    authTokenDAO: AuthTokenDAO
  ) {
    this.feedDAO = feedDAO;
    this.storyDAO = storyDAO;
    this.authTokenDAO = authTokenDAO;
  }

  private async checkAuthTokenValidity(token: string): Promise<void> {
    const userAlias = await this.authTokenDAO.doesAuthTokenExist(token);
    if (!userAlias) {
      throw new Error("Invalid authentication token.");
    }
  }

  public async loadMoreFeedItems(
    token: string,
    userAlias: string,
    pageSize: number,
    lastItem: StatusDto | null
  ): Promise<[StatusDto[], boolean]> {
    this.checkAuthTokenValidity(token);
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

    await this.storyDAO.addStory(newStatus.user.alias, newStatus);

    const messageBody = JSON.stringify({
      status: newStatus,
      receiverAlias: newStatus.user.alias,
    });

    await this.sqsClient.send(
      new SendMessageCommand({
        QueueUrl: this.statusFanOutQueueUrl,
        MessageBody: messageBody,
      })
    );
  }
}

export default StatusService;
