import { AuthToken, User, UserDto } from "tweeter-shared";
import bcrypt from "bcryptjs";
import { ImageS3DAO } from "../dao/dynamodb/ImageS3DAO";
import { UserDynamoDAO } from "../dao/dynamodb/UserDynamoDAO";
import { AuthTokenDynamoDAO } from "../dao/dynamodb/AuthTokenDynamoDAO";

export class UserService {
  private imageDAO: ImageS3DAO;
  private userDAO: UserDynamoDAO;
  private authTokenDAO: AuthTokenDynamoDAO;

  constructor() {
    this.imageDAO = new ImageS3DAO();
    this.userDAO = new UserDynamoDAO();
    this.authTokenDAO = new AuthTokenDynamoDAO();
  }

  public async getUser(token: string, alias: string): Promise<User | null> {
    try {
      const userDetails = await this.userDAO.getUser(alias);

      if (!userDetails) {
        return null;
      }

      const user: User = User.fromDto(userDetails[0])!

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
    const existingUserDetails = await this.userDAO.getUser(alias);
    if (existingUserDetails) {
      throw new Error("Alias already taken.");
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const fileName = `${alias}-profile.${imageFileExtension}`;
    const imageUrl = await this.imageDAO.putImage(fileName, userImageBytes);

    const user: UserDto = {
      firstName,
      lastName,
      alias,
      imageUrl: imageUrl,
    };

    const newUser: User = User.fromDto(user)!

    try {
      await this.userDAO.createUser(user, hashedPassword);
    } catch (error) {
      console.error("Error saving user to DynamoDB:", error);
      throw new Error("Could not save user.");
    }

    const token: string = await this.authTokenDAO.createAuthToken();
    const authToken = new AuthToken(token, Date.now())

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

    const token: string = await this.authTokenDAO.createAuthToken();
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
