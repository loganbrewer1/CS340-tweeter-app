import { AuthToken, User, UserDto } from "tweeter-shared";
import bcrypt from "bcryptjs";
import { AuthTokenDAO } from "../dao/interfaces/AuthTokenDAO";
import { ImageDAO } from "../dao/interfaces/ImageDAO";
import { UserDAO } from "../dao/interfaces/UserDAO";

export class UserService {
  private imageDAO: ImageDAO;
  private userDAO: UserDAO;
  private authTokenDAO: AuthTokenDAO;

  constructor(
    imageDAO: ImageDAO,
    userDAO: UserDAO,
    authTokenDAO: AuthTokenDAO
  ) {
    this.imageDAO = imageDAO;
    this.userDAO = userDAO;
    this.authTokenDAO = authTokenDAO;
  }

  public async getUser(token: string, alias: string): Promise<User | null> {
    try {
      const userDetails = await this.userDAO.getUser(alias);

      if (!userDetails) {
        return null;
      }

      const user: User = User.fromDto(userDetails[0])!;

      return user;
    } catch (error) {
      console.error("Error getting user:", error);
      throw new Error("Could not retrieve user.");
    }
  }

  public async register(
    firstName: string,
    lastName: string,
    alias: string,
    password: string,
    userImageBytes: string,
    imageFileExtension: string
  ): Promise<[User, AuthToken]> {
    console.log("Checking if alias is already taken");
    const existingUserDetails = await this.userDAO.getUser(alias);
    if (existingUserDetails) {
      throw new Error("Alias already taken.");
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    console.log("Attempting to put new image in s3 bucket");
    const fileName = `${alias}-profile.${imageFileExtension}`;
    const imageUrl = await this.imageDAO.putImage(fileName, userImageBytes);

    const user: UserDto = {
      firstName,
      lastName,
      alias,
      imageUrl: imageUrl,
    };

    const newUser: User = User.fromDto(user)!;

    try {
      console.log("Attempting to create new user...");
      await this.userDAO.createUser(user, hashedPassword);
    } catch (error) {
      console.error("Error saving user to DynamoDB:", error);
      throw new Error("Could not save user.");
    }

    const token: string = await this.authTokenDAO.createAuthToken(
      newUser.alias
    );
    const authToken = new AuthToken(token, Date.now());

    return [newUser, authToken];
  }

  public async login(
    alias: string,
    password: string
  ): Promise<[User, AuthToken]> {
    const userDetails = await this.userDAO.getUser(alias);

    if (!userDetails) {
      throw new Error("Invalid alias or password.");
    }

    const hashedPassword = userDetails[1];
    const existingUser = userDetails[0];
    const isPasswordValid = await bcrypt.compare(password, hashedPassword);
    if (!isPasswordValid) {
      throw new Error("Invalid alias or password.");
    }

    const newUser: User = User.fromDto(existingUser)!;

    const token: string = await this.authTokenDAO.createAuthToken(
      newUser.alias
    );
    const authToken = new AuthToken(token, Date.now());

    return [newUser, authToken];
  }

  public async logout(token: string): Promise<void> {
    const tokenExists = await this.authTokenDAO.doesAuthTokenExist(token);
    if (!tokenExists) {
      throw new Error("Invalid token.");
    }

    await this.authTokenDAO.deleteAuthToken(token);
  }
}
