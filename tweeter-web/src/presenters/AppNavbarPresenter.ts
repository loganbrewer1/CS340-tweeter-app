import { AuthToken } from "tweeter-shared";
import { UserService } from "../model/service/UserService";

export interface AppNavbarView {
  clearUserInfo: () => void;
  clearLastInfoMessage: () => void;
  displayErrorMessage: (message: string, bootstrapClasses?: string) => void;
  displayInfoMessage: (
    message: string,
    duration: number,
    bootstrapClasses?: string
  ) => void;
}

export class AppNavbarPresenter {
  private _view: AppNavbarView;
  private userService: UserService;

  public constructor(view: AppNavbarView) {
    this._view = view;
    this.userService = new UserService();
  }

  protected get view() {
    return this._view;
  }

  public async logOut(authToken: AuthToken) {
    this.view.displayInfoMessage("Logging Out...", 0);

    try {
      await this.userService.logout(authToken!);

      this.view.clearLastInfoMessage();
      this.view.clearUserInfo();
    } catch (error) {
      this.view.displayErrorMessage(
        `Failed to log user out because of exception: ${error}`
      );
    }
  }
}
