import { AuthToken, User } from "tweeter-shared";
import { Presenter, View } from "./Presenter";
import { UserService } from "../model/service/UserService";

export interface AuthView extends View {
  setIsLoading: (isLoading: boolean) => void;
  navigate: (path: string) => void;
  updateUserInfo: (
    currentUser: User,
    displayedUser: User | null,
    authToken: AuthToken,
    remember: boolean
  ) => void;
}

export abstract class AuthPresenter<V extends AuthView> extends Presenter<V> {
  protected userService: UserService;

  public constructor(view: V) {
    super(view);
    this.userService = new UserService();
  }

  protected async handleAuthAction(
    action: () => Promise<[User, AuthToken]>,
    rememberMe: boolean,
    operationDescription: string,
    navigationPath: string
  ) {
    await this.doFailureReportingOperation(async () => {
      this.view.setIsLoading(true);
      const [user, authToken] = await action();
      this.view.updateUserInfo(user, user, authToken, rememberMe);
      this.view.navigate(navigationPath);
    }, operationDescription);
    this.view.setIsLoading(false);
  }
}
