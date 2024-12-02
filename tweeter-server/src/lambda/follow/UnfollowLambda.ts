import { FollowChangeResponse, FollowRelatedRequest } from "tweeter-shared";
import FollowService from "../../model/service/FollowService";
import { FollowDynamoDAO } from "../../model/dao/dynamodb/FollowDynamoDAO";
import { AuthTokenDynamoDAO } from "../../model/dao/dynamodb/AuthTokenDynamoDAO";

export const handler = async (
  request: FollowRelatedRequest
): Promise<FollowChangeResponse> => {
  const followService = new FollowService(new FollowDynamoDAO(), new AuthTokenDynamoDAO());
  const [followerCount, followeeCount] = await followService.unfollow(
    request.token,
    request.user
  );

  return {
    success: true,
    message: null,
    followeeCount: followeeCount,
    followerCount: followerCount,
  };
};
