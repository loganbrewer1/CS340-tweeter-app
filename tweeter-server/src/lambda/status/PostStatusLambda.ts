import { PostStatusRequest, TweeterResponse } from "tweeter-shared";
import StatusService from "../../model/service/StatusService";
import { FeedDynamoDAO } from "../../model/dao/dynamodb/FeedDynamoDAO";
import { StoryDynamoDAO } from "../../model/dao/dynamodb/StoryDynamoDAO";
import { AuthTokenDynamoDAO } from "../../model/dao/dynamodb/AuthTokenDynamoDAO";

export const handler = async (
  request: PostStatusRequest
): Promise<TweeterResponse> => {
  const statusService = new StatusService(new FeedDynamoDAO(), new StoryDynamoDAO(), new AuthTokenDynamoDAO());
  await statusService.postStatus(request.token, request.newStatus);

  return {
    success: true,
    message: null,
  };
};
