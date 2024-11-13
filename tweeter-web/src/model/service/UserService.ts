import { AuthToken, User, GetUserRequest, TweeterRequest, LoginRequest, RegisterRequest } from "tweeter-shared";
import { ServerFacade } from "../network/ServerFacade";

export class UserService {
  private serverFacade = new ServerFacade();
  
  public async getUser(
    requestObject: GetUserRequest
  ): Promise<User | null> {
    return this.serverFacade.getUser(requestObject)
  }

  public async register(
    requestObject: RegisterRequest 
  ): Promise<[User, AuthToken]> {
    return this.serverFacade.register(requestObject)
  }

  login = async (
    requestObject: LoginRequest
  ): Promise<[User, AuthToken]> => {
    return this.serverFacade.login(requestObject)
  };

  logout = async (requestObject: TweeterRequest): Promise<void> => {
    this.serverFacade.logout(requestObject)
  };
}
