import { Buffer } from "buffer";
import { AuthToken, User, FakeData, GetUserRequest, TweeterRequest, LoginRequest } from "tweeter-shared";
import { ServerFacade } from "../network/ServerFacade";

export class UserService {
  private serverFacade = new ServerFacade();
  
  public async getUser(
    requestObject: GetUserRequest
  ): Promise<User | null> {
    return this.serverFacade.getUser(requestObject)
  }

  public async register(
    firstName: string,
    lastName: string,
    alias: string,
    password: string,
    userImageBytes: Uint8Array,
    imageFileExtension: string
  ): Promise<[User, AuthToken]> {
    // Not neded now, but will be needed when you make the request to the server in milestone 3
    const imageStringBase64: string =
      Buffer.from(userImageBytes).toString("base64");

    // TODO: Replace with the result of calling the server
    const user = FakeData.instance.firstUser;

    if (user === null) {
      throw new Error("Invalid registration");
    }

    return [user, FakeData.instance.authToken];
  }

  login = async (
    requestObject: LoginRequest
  ): Promise<[User, string]> => {
    return this.serverFacade.login(requestObject)
  };

  logout = async (requestObject: TweeterRequest): Promise<void> => {
    this.serverFacade.logout(requestObject)
  };
}
