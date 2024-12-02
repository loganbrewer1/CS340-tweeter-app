import { IsFollowerRequest, IsFollowerResponse } from "tweeter-shared";
import FollowService from "../../model/service/FollowService";
import { AuthTokenDynamoDAO } from "../../model/dao/dynamodb/AuthTokenDynamoDAO";
import { FollowDynamoDAO } from "../../model/dao/dynamodb/FollowDynamoDAO";

export const handler = async (
  request: IsFollowerRequest
): Promise<IsFollowerResponse> => {
  const followService = new FollowService(
    new FollowDynamoDAO(),
    new AuthTokenDynamoDAO()
  );
  const isFollower = await followService.getIsFollowerStatus(
    request.token,
    request.user,
    request.selectedUser
  );

  return {
    success: true,
    message: null,
    isFollower: isFollower,
  };
};
