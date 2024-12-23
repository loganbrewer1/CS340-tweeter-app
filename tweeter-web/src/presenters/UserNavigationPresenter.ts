import { AuthToken, GetUserRequest, User } from "tweeter-shared";
import { UserService } from "../model/service/UserService";
import { Presenter, View } from "./Presenter";

export interface UserNavigationView extends View {
  setDisplayedUser: (user: User) => void;
}

export class UserNavigationPresenter extends Presenter<UserNavigationView> {
  private userService: UserService;

  constructor(view: UserNavigationView) {
    super(view);
    this.userService = new UserService();
  }

  public async navigateToUser(
    authToken: AuthToken | null,
    currentUser: User | null,
    alias: string
  ): Promise<void> {
    this.doFailureReportingOperation(async () => {
      const request: GetUserRequest = {
        token: authToken!.token,
        userAlias: alias,
      };

      const user = await this.userService.getUser(request);

      if (!!user) {
        if (currentUser!.equals(user)) {
          this.view.setDisplayedUser(currentUser!);
        } else {
          this.view.setDisplayedUser(user);
        }
      }
    }, "get user");
  }
}
