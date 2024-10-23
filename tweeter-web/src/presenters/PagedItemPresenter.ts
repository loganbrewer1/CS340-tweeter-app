import { AuthToken, User } from "tweeter-shared";
import { Presenter, View } from "./Presenter";

export const PAGE_SIZE = 10;

export interface PagedItemView<T> extends View {
  addItems: (items: T[]) => void;
}

export abstract class PagedItemPresenter<T, U> extends Presenter<
  PagedItemView<T>
> {
  private _service: U;
  private _hasMoreItems: boolean = true;
  private _lastItem: T | null = null;

  public constructor(view: PagedItemView<T>) {
    super(view);
    this._service = this.createService();
  }

  protected abstract createService(): U;

  protected get service() {
    return this._service;
  }

  public get hasMoreItems(): boolean {
    return this._hasMoreItems;
  }

  protected set hasMoreItems(value: boolean) {
    this._hasMoreItems = value;
  }

  protected get lastItem(): T | null {
    return this._lastItem;
  }

  protected set lastItem(user: T | null) {
    this._lastItem = user;
  }

  public async loadMoreItems(authToken: AuthToken, user: string): Promise<void> {
    this.doFailureReportingOperation(async () => {
      if (this.hasMoreItems) {
        let [newItems, hasMoreItems] = await this.getMoreItems(authToken, user);

        this.hasMoreItems = hasMoreItems;
        this.lastItem = newItems[newItems.length - 1];
        this.view.addItems(newItems);
      }
    }, this.getItemDescription());
  }

  protected abstract getMoreItems(
    authToken: AuthToken,
    user: string
  ): Promise<[T[], boolean]>;

  protected abstract getItemDescription(): string;
}
