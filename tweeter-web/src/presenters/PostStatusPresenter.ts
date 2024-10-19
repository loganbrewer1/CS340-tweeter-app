import { AuthToken, Status, User } from "tweeter-shared";
import StatusService from "../model/service/StatusService";

export interface PostStatusView {
  setPost: (post: string) => void;
  setIsLoading: (isLoading: boolean) => void;
  clearLastInfoMessage: () => void;
  displayErrorMessage: (message: string, bootstrapClasses?: string) => void;
  displayInfoMessage: (
    message: string,
    duration: number,
    bootstrapClasses?: string
  ) => void;
}

export class PostStatusPresenter {
  private _view: PostStatusView;
  private statusService: StatusService;

  public constructor(view: PostStatusView) {
    this._view = view;
    this.statusService = new StatusService();
  }

  protected get view() {
    return this._view;
  }

  public async submitPost(event: React.MouseEvent, post: string, currentUser: User, authToken: AuthToken) {
    event.preventDefault();

    try {
      this.view.setIsLoading(true);
      this.view.displayInfoMessage("Posting status...", 0);

      const status = new Status(post, currentUser!, Date.now());

      await this.statusService.postStatus(authToken!, status);

      this.view.setPost("");
      this.view.displayInfoMessage("Status posted!", 2000);
    } catch (error) {
      this.view.displayErrorMessage(
        `Failed to post the status because of exception: ${error}`
      );
    } finally {
      this.view.clearLastInfoMessage();
      this.view.setIsLoading(false);
    }
  }
}