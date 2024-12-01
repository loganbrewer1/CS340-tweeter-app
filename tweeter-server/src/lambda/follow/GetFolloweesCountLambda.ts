import { FollowRelatedRequest, GetCountResponse } from "tweeter-shared";
import FollowService from "../../model/service/FollowService";

export const handler = async (
  request: FollowRelatedRequest
): Promise<GetCountResponse> => {
  const followService = new FollowService();
  const count = await followService.getFolloweeCount(
    request.token,
    request.user.alias
  );

  return {
    success: true,
    message: null,
    count: count,
  };
};
