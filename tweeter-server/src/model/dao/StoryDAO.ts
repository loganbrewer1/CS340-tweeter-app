import { Status } from "tweeter-shared";

export interface StoryDAO {
  addStoryStatus(senderAlias: string, status: Status): Promise<void>;
  getUserStory(
    senderAlias: string,
    lastItemTimestamp?: number,
    pageSize?: number
  ): Promise<[Status[], boolean]>;
}
