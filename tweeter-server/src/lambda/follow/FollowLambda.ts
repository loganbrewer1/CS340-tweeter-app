import { FollowChangeResponse, FollowRelatedRequest } from "tweeter-shared";
import FollowService from "../../model/service/FollowService";
import { AuthTokenDynamoDAO } from "../../model/dao/dynamodb/AuthTokenDynamoDAO";
import { FollowDynamoDAO } from "../../model/dao/dynamodb/FollowDynamoDAO";

export const handler = async (
  request: FollowRelatedRequest
): Promise<FollowChangeResponse> => {
  const followService = new FollowService(
    new FollowDynamoDAO(),
    new AuthTokenDynamoDAO()
  );
  const [followerCount, followeeCount] = await followService.follow(
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
