import { LoginRequest } from "tweeter-shared";
import { AuthPresenter, AuthView } from "./AuthPresenter";

export interface LoginView extends AuthView {
  originalUrl?: string;
}

export class LoginPresenter extends AuthPresenter<LoginView> {
  public constructor(view: LoginView) {
    super(view);
  }

  public async doLogin(alias: string, password: string, rememberMe: boolean) {
    let pathToSend: string;

    if (!!this.view.originalUrl) {
      pathToSend = this.view.originalUrl;
    } else {
      pathToSend = "/";
    }

    const request: LoginRequest = {
      alias: alias,
      password: password,
      token: ""
    };

    await this.handleAuthAction(
      () => this.userService.login(request),
      rememberMe,
      "log user in",
      pathToSend
    );
  }
}
