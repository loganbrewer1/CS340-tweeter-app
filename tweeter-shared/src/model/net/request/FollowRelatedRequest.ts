import { UserDto } from "../../dto/UserDto";
import { TweeterRequest } from "./TweeterRequest";

export interface FollowRelatedRequest extends TweeterRequest {
  readonly user: UserDto;
}
