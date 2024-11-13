import { Buffer } from "buffer";
import { AuthToken, User, FakeData } from "tweeter-shared";

export class UserService {
  public async getUser(
    token: string,
    alias: string
  ): Promise<User | null> {
    return FakeData.instance.findUserByAlias(alias);
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
    alias: string,
    password: string
  ): Promise<[User, AuthToken]> => {
    const user = FakeData.instance.firstUser;

    if (user === null) {
      throw new Error("Invalid alias or password");
    }

    return [user, FakeData.instance.authToken];
  };

  logout = async (token: string): Promise<void> => {
    await new Promise((res) => setTimeout(res, 1000));
  };
}
