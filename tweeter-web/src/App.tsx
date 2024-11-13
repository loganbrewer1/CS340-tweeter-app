import "./App.css";
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import Login from "./components/authentication/login/Login";
import Register from "./components/authentication/register/Register";
import MainLayout from "./components/mainLayout/MainLayout";
import Toaster from "./components/toaster/Toaster";
import useUserInfo from "./components/userInfo/UserInfoHook";
import { FolloweePresenter } from "./presenters/FolloweePresenter";
import { FollowerPresenter } from "./presenters/FollowerPresenter";
import { FeedPresenter } from "./presenters/FeedPresenter";
import { StoryPresenter } from "./presenters/StoryPresenter";
import {
  RegisterPresenter,
  RegisterView,
} from "./presenters/RegisterPresenter";
import { LoginPresenter, LoginView } from "./presenters/LoginPresenter";
import ItemScroller from "./components/mainLayout/ItemScroller";
import { PagedItemView } from "./presenters/PagedItemPresenter";
import { Status, User } from "tweeter-shared";
import UserItem from "./components/userItem/UserItem";
import StatusItem from "./components/statusItem/StatusItem";

const App = () => {
  const { currentUser, authToken } = useUserInfo();

  const isAuthenticated = (): boolean => {
    return !!currentUser && !!authToken;
  };

  return (
    <div>
      <Toaster position="top-right" />
      <BrowserRouter>
        {isAuthenticated() ? (
          <AuthenticatedRoutes />
        ) : (
          <UnauthenticatedRoutes />
        )}
      </BrowserRouter>
    </div>
  );
};

const AuthenticatedRoutes = () => {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route index element={<Navigate to="/feed" />} />
        <Route
          key={1}
          path="feed"
          element={
            <ItemScroller
              key={1}
              presenterGenerator={(view: PagedItemView<Status>) =>
                new FeedPresenter(view)
              }
              itemComponentGenerator={(status) => <StatusItem value={status} />}
            />
          }
        />
        <Route
          key={2}
          path="story"
          element={
            <ItemScroller
              key={2}
              presenterGenerator={(view: PagedItemView<Status>) =>
                new StoryPresenter(view)
              }
              itemComponentGenerator={(status) => <StatusItem value={status} />}
            />
          }
        />
        <Route
          path="followees"
          element={
            <ItemScroller
              key={3}
              presenterGenerator={(view: PagedItemView<User>) =>
                new FolloweePresenter(view)
              }
              itemComponentGenerator={(user) => <UserItem value={user} />}
            />
          }
        />
        <Route
          path="followers"
          element={
            <ItemScroller
              key={4}
              presenterGenerator={(view: PagedItemView<User>) =>
                new FollowerPresenter(view)
              }
              itemComponentGenerator={(user) => <UserItem value={user} />}
            />
          }
        />
        <Route path="logout" element={<Navigate to="/login" />} />
        <Route path="*" element={<Navigate to="/feed" />} />
      </Route>
    </Routes>
  );
};

const UnauthenticatedRoutes = () => {
  const location = useLocation();

  return (
    <Routes>
      <Route
        path="/login"
        element={
          <Login
            presenterGenerator={(view: LoginView) => new LoginPresenter(view)}
          />
        }
      />
      <Route
        path="/register"
        element={
          <Register
            presenterGenerator={(view: RegisterView) =>
              new RegisterPresenter(view)
            }
          />
        }
      />
      <Route
        path="*"
        element={
          <Login
            presenterGenerator={(view: LoginView) => new LoginPresenter(view)}
            originalUrl={location.pathname}
          />
        }
      />
    </Routes>
  );
};

export default App;
