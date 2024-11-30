import { StatusDto } from "tweeter-shared";

export interface StoryDAO {
  addStory(senderAlias: string, status: StatusDto): Promise<void>;
  getUserStories(
    senderAlias: string,
    lastItemTimestamp?: number,
    pageSize?: number
  ): Promise<[StatusDto[], boolean]>;
}
