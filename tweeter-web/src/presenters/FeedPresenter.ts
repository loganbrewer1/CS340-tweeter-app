import { AuthToken, PagedStatusItemRequest, Status } from "tweeter-shared";
import { StatusItemPresenter } from "./StatusItemPresenter";
import { PAGE_SIZE } from "./PagedItemPresenter";

export class FeedPresenter extends StatusItemPresenter {
  protected getMoreItems(
    authToken: AuthToken,
    user: string
  ): Promise<[Status[], boolean]> {
    const lastItemDto = this.lastItem ? this.lastItem.dto : null;

    const request: PagedStatusItemRequest = {
      token: authToken.token,
      userAlias: user,
      pageSize: PAGE_SIZE,
      lastItem: lastItemDto,
    };

    return this.service.loadMoreFeedItems(request)
  }

  protected getItemDescription(): string {
    return "load feed";
  }
}
