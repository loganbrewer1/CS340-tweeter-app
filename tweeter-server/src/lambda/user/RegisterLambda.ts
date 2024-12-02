import { LoginResponse, RegisterRequest } from "tweeter-shared";
import { UserService } from "../../model/service/UserService";
import { ImageS3DAO } from "../../model/dao/dynamodb/ImageS3DAO";
import UserDynamoDAO from "../../model/dao/dynamodb/UserDynamoDAO";
import { AuthTokenDynamoDAO } from "../../model/dao/dynamodb/AuthTokenDynamoDAO";

export const handler = async (
  request: RegisterRequest
): Promise<LoginResponse> => {
  const userService = new UserService(new ImageS3DAO(), new UserDynamoDAO(), new AuthTokenDynamoDAO());
  const [user, authToken] = await userService.register(
    request.firstName,
    request.lastName,
    request.alias,
    request.password,
    request.userImageBytes,
    request.imageFileExtension
  );

  return {
    success: true,
    message: null,
    token: authToken.token,
    user: user.dto,
  };
};
