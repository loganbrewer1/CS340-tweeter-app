import { LoginResponse, RegisterRequest } from "tweeter-shared";
import { UserService } from "../../model/service/UserService";

export const handler = async (
  request: RegisterRequest
): Promise<LoginResponse> => {
  const userService = new UserService();
  const [user, authToken] = await userService.register(
    request.firstName,
    request.lastName,
    request.alias,
    request.password,
    request.imageFileExtension,
    request.imageFileExtension
  );

  return {
    success: true,
    message: null,
    token: authToken.token,
    user: user.dto,
  };
};
