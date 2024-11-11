import { AuthToken, PagedUserItemRequest, User } from "tweeter-shared";
import { UserItemPresenter } from "./UserItemPresenter";
import { PAGE_SIZE } from "./PagedItemPresenter";

export class FolloweePresenter extends UserItemPresenter {
  protected getMoreItems(
    authToken: AuthToken,
    user: string
  ): Promise<[User[], boolean]> {
    const lastItemDto = this.lastItem ? this.lastItem.dto : null;
    
    const request: PagedUserItemRequest = {
      token: authToken.token,
      userAlias: user,
      pageSize: PAGE_SIZE,
      lastItem: lastItemDto
    };

    return this.service.loadMoreFollowees(request);
  }

  protected getItemDescription(): string {
    return "load followees";
  }
}
