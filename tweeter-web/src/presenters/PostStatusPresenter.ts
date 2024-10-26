import { AuthToken, Status, User } from "tweeter-shared";
import StatusService from "../model/service/StatusService";
import { InfoPresenter, InfoView } from "./InfoPresenter";

export interface PostStatusView extends InfoView {
  setPost: (post: string) => void;
  setIsLoading: (isLoading: boolean) => void;
}

export class PostStatusPresenter extends InfoPresenter<StatusService, PostStatusView> {

  public constructor(view: PostStatusView) {
    super(view);
  }

  protected createService(): StatusService {
    return new StatusService();
  }

  public async submitPost(
    event: React.MouseEvent,
    post: string,
    currentUser: User,
    authToken: AuthToken
  ) {
    event.preventDefault();

    await this.doFailureReportingOperation(async () => {
      this.view.setIsLoading(true);
      this.view.displayInfoMessage("Posting status...", 0);

      const status = new Status(post, currentUser!, Date.now());

      await this.service.postStatus(authToken!, status);

      this.view.setPost("");
      this.view.displayInfoMessage("Status posted!", 2000);
    }, "post the status");
    this.view.clearLastInfoMessage();
    this.view.setIsLoading(false);
  }
}
