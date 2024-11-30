import { StatusDto } from "tweeter-shared";

export interface FeedDAO {
  addStatusToFeeds(receiverAlias: string, status: StatusDto): Promise<void>;
  getFeedForUser(
    receiverAlias: string,
    lastItemTimestamp?: string,
    pageSize?: number
  ): Promise<[StatusDto[], boolean]>;
}
