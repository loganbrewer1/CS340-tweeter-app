import { TweeterResponse } from "./TweeterResponse";

export interface FollowChangeResponse extends TweeterResponse {
  readonly followerCount: number;
  readonly followeeCount: number;
}
