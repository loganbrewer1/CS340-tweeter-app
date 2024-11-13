import { GetUserRequest, GetUserResponse, PostStatusRequest, TweeterResponse, User } from "tweeter-shared";
import { UserService } from "../../model/service/UserService";

export const handler = async (
  request: GetUserRequest
): Promise<GetUserResponse> => {
  const userService = new UserService();
  const user: User | null = await userService.getUser(request.token, request.userAlias)
  

  return {
    success: true,
    message: null,
    user: user?.dto ?? null
  };
};
