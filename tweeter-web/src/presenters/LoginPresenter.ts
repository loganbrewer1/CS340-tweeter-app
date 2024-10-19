import { User, AuthToken } from "tweeter-shared";
import { UserService } from "../model/service/UserService";

export interface LoginView {
  setAlias: (alias: string) => void;
  setPassword: (password: string) => void;
  setRememberMe: (remember: boolean) => void;
  setIsLoading: (isLoading: boolean) => void;

  navigate: (path: string) => void;
  updateUserInfo: (
    currentUser: User,
    displayedUser: User | null,
    authToken: AuthToken,
    remember: boolean
  ) => void;
  displayErrorMessage: (message: string) => void;
  originalUrl?: string;
}

export class LoginPresenter {
  private _view: LoginView;
  private userService: UserService;

  public constructor(view: LoginView) {
    this._view = view;
    this.userService = new UserService();
  }

  protected get view() {
    return this._view;
  }
  public async doLogin(alias: string, password: string, rememberMe: boolean) {
    try {
      this.view.setIsLoading(true);

      const [user, authToken] = await this.userService.login(alias, password);

      this.view.updateUserInfo(user, user, authToken, rememberMe);

      if (!!this.view.originalUrl) {
        this.view.navigate(this.view.originalUrl);
      } else {
        this.view.navigate("/");
      }
    } catch (error) {
      this.view.displayErrorMessage(
        `Failed to log user in because of exception: ${error}`
      );
    } finally {
      this.view.setIsLoading(false);
    }
  }
}