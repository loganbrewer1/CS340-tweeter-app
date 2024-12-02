import {
  PagedStatusItemRequest,
  PagedStatusItemResponse,
} from "tweeter-shared";
import StatusService from "../../model/service/StatusService";
import { AuthTokenDynamoDAO } from "../../model/dao/dynamodb/AuthTokenDynamoDAO";
import { FeedDynamoDAO } from "../../model/dao/dynamodb/FeedDynamoDAO";
import { StoryDynamoDAO } from "../../model/dao/dynamodb/StoryDynamoDAO";

export const handler = async (
  request: PagedStatusItemRequest
): Promise<PagedStatusItemResponse> => {
  const statusService = new StatusService(
    new FeedDynamoDAO(),
    new StoryDynamoDAO(),
    new AuthTokenDynamoDAO()
  );
  const [items, hasMore] = await statusService.loadMoreStoryItems(
    request.token,
    request.userAlias,
    request.pageSize,
    request.lastItem
  );

  return {
    success: true,
    message: null,
    items: items,
    hasMore: hasMore,
  };
};
