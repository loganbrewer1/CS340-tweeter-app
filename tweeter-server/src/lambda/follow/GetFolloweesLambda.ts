import { PagedUserItemRequest, PagedUserItemResponse } from "tweeter-shared";
import FollowService from "../../model/service/FollowService";
import { AuthTokenDynamoDAO } from "../../model/dao/dynamodb/AuthTokenDynamoDAO";
import { FollowDynamoDAO } from "../../model/dao/dynamodb/FollowDynamoDAO";

export const handler = async (
  request: PagedUserItemRequest
): Promise<PagedUserItemResponse> => {
  const followService = new FollowService(
    new FollowDynamoDAO(),
    new AuthTokenDynamoDAO()
  );
  const [items, hasMore] = await followService.loadMoreFollowees(
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
