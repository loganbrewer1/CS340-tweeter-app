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

    await this.handleAuthAction(
      () => this.userService.login(alias, password),
      rememberMe,
      "log user in",
      pathToSend
    );
  }
}
