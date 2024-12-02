import { FollowRelatedRequest, GetCountResponse } from "tweeter-shared";
import FollowService from "../../model/service/FollowService";
import { AuthTokenDynamoDAO } from "../../model/dao/dynamodb/AuthTokenDynamoDAO";
import { FollowDynamoDAO } from "../../model/dao/dynamodb/FollowDynamoDAO";

export const handler = async (
  request: FollowRelatedRequest
): Promise<GetCountResponse> => {
  const followService = new FollowService(
    new FollowDynamoDAO(),
    new AuthTokenDynamoDAO()
  );
  const count = await followService.getFollowerCount(
    request.token,
    request.user.alias
  );

  return {
    success: true,
    message: null,
    count: count,
  };
};
