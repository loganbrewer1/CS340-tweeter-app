import { User, AuthToken } from "tweeter-shared";
import {
  UserNavigationPresenter,
  UserNavigationView,
} from "../../presenters/UserNavigationPresenter";
import { useState } from "react";

const useNavigateToUser = (
  setDisplayedUser: (user: User) => void,
  currentUser: User | null,
  authToken: AuthToken | null,
  displayErrorMessage: (message: string, bootstrapClasses?: string) => void
) => {
  const listener: UserNavigationView = {
    setDisplayedUser: (user) => setDisplayedUser(user),
    displayErrorMessage: (message) => displayErrorMessage(message),
  };

  const [presenter] = useState(() => new UserNavigationPresenter(listener));

  // The navigateToUser function stays the same, using the presenter
  const navigateToUser = async (event: React.MouseEvent): Promise<void> => {
    presenter.navigateToUser(event, authToken, currentUser);
  };

  return { navigateToUser };
};

export default useNavigateToUser;
