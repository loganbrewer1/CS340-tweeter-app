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
    userImageBytes: string,
    imageFileExtension: string
  ): Promise<[User, AuthToken]> {
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
