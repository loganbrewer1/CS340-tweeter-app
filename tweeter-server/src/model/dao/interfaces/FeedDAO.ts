import { StatusDto } from "tweeter-shared";

export interface FeedDAO {
  addStatusToFeeds(receiverAlias: string, status: StatusDto): Promise<void>;
  getFeedForUser(
    receiverAlias: string,
    lastItemTimestamp?: number,
    pageSize?: number
  ): Promise<[StatusDto[], boolean]>;
}
