import { TweeterRequest, TweeterResponse } from "tweeter-shared";
import { UserService } from "../../model/service/UserService";
import { AuthTokenDynamoDAO } from "../../model/dao/dynamodb/AuthTokenDynamoDAO";
import { ImageS3DAO } from "../../model/dao/dynamodb/ImageS3DAO";
import UserDynamoDAO from "../../model/dao/dynamodb/UserDynamoDAO";

export const handler = async (
  request: TweeterRequest
): Promise<TweeterResponse> => {
  const userService = new UserService(
    new ImageS3DAO(),
    new UserDynamoDAO(),
    new AuthTokenDynamoDAO()
  );
  await userService.logout(request.token);

  return {
    success: true,
    message: null,
  };
};
