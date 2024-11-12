import { FollowChangeResponse, FollowRelatedRequest } from "tweeter-shared";
import FollowService from "../../model/service/FollowService";

export const handler = async (
  request: FollowRelatedRequest
): Promise<FollowChangeResponse> => {
  const followService = new FollowService();
  const [followerCount, followeeCount] = await followService.follow(
    request.token,
    request.user
  );

  return {
    success: true,
    message: null,
    followeeCount: followeeCount,
    followerCount: followerCount
  };
};
