import { AuthToken } from "tweeter-shared";
import { UserService } from "../model/service/UserService";
import { InfoPresenter, InfoView } from "./InfoPresenter";

export interface AppNavbarView extends InfoView {
  clearUserInfo: () => void;
}

export class AppNavbarPresenter extends InfoPresenter<
  UserService,
  AppNavbarView
> {
  public constructor(view: AppNavbarView) {
    super(view);
  }

  protected createService(): UserService {
    return new UserService();
  }

  public async logOut(authToken: AuthToken) {
    this.view.displayInfoMessage("Logging Out...", 0);
    await this.doFailureReportingOperation(async () => {
      await this.service.logout(authToken!);
      this.view.clearLastInfoMessage();
      this.view.clearUserInfo();
    }, "log user out");
  }
}
