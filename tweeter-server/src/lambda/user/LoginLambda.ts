import { AuthToken, LoginRequest, LoginResponse, User } from "tweeter-shared";
import { UserService } from "../../model/service/UserService";
import { AuthTokenDynamoDAO } from "../../model/dao/dynamodb/AuthTokenDynamoDAO";
import { ImageS3DAO } from "../../model/dao/dynamodb/ImageS3DAO";
import UserDynamoDAO from "../../model/dao/dynamodb/UserDynamoDAO";

export const handler = async (
  request: LoginRequest
): Promise<LoginResponse> => {
  const userService = new UserService(
    new ImageS3DAO(),
    new UserDynamoDAO(),
    new AuthTokenDynamoDAO()
  );
  try {
    const [user, authToken] = await userService.login(
      request.alias,
      request.password
    );
    return {
      success: true,
      message: null,
      token: authToken.token,
      user: user.dto,
    };
  } catch (e) {
    if ((e as Error).message === "Invalid alias or password.") {
      return {
        success: false,
        message: "Invalid alias or password.",
        token: "",
        user: new User('','','','').dto,
      };
    }
  }

    return {
      success: false,
      message: "An unknown error occurred.",
      token: "",
      user: new User("", "", "", "").dto,
    };
};
