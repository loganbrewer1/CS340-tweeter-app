import {
  GetUserRequest,
  GetUserResponse,
  User
} from "tweeter-shared";
import { UserService } from "../../model/service/UserService";
import { AuthTokenDynamoDAO } from "../../model/dao/dynamodb/AuthTokenDynamoDAO";
import { ImageS3DAO } from "../../model/dao/dynamodb/ImageS3DAO";
import UserDynamoDAO from "../../model/dao/dynamodb/UserDynamoDAO";

export const handler = async (
  request: GetUserRequest
): Promise<GetUserResponse> => {
  const userService = new UserService(
    new ImageS3DAO(),
    new UserDynamoDAO(),
    new AuthTokenDynamoDAO()
  );
  const user: User | null = await userService.getUser(
    request.token,
    request.userAlias
  );

  return {
    success: true,
    message: null,
    user: user?.dto ?? null,
  };
};
