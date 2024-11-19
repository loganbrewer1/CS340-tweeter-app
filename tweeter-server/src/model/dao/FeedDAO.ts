import { Status } from "tweeter-shared";

export interface FeedDAO {
  addStatusToFeed(receiverAlias: string, status: Status): Promise<void>;
  getFeedForUser(
    receiverAlias: string,
    lastItemTimestamp?: string,
    pageSize?: number
  ): Promise<[Status[], boolean]>;
}
