import { AuthToken, LoginRequest, LoginResponse, User } from "tweeter-shared";
import { UserService } from "../../model/service/UserService";

export const handler = async (
  request: LoginRequest
): Promise<LoginResponse> => {
  const userService = new UserService();
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
