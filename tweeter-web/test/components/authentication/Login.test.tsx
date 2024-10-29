import React from "react";
import { MemoryRouter } from "react-router-dom";
import Login from "../../../src/components/authentication/login/Login";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  LoginView,
  LoginPresenter,
} from "../../../src/presenters/LoginPresenter";
import "@testing-library/jest-dom";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fab } from "@fortawesome/free-brands-svg-icons";
import { mock, instance, verify } from "ts-mockito";

library.add(fab);

describe("Login Component", () => {
  it("starts with the sign-in button disabled", () => {
    const { signInButton } = renderLoginAndGetElements("/");
    expect(signInButton).toBeDisabled();
  });

  it("enables the sign-in button if both alias and password fields have text", async () => {
    const { signInButton, aliasField, passwordField, user } =
      renderLoginAndGetElements("/");

    await user.type(aliasField, "a");
    await user.type(passwordField, "b");
    expect(signInButton).toBeEnabled();
  });

  it("disables the sign-in button if either field is cleared", async () => {
    const { signInButton, aliasField, passwordField, user } =
      renderLoginAndGetElements("/");

    await user.type(aliasField, "a");
    await user.type(passwordField, "b");
    expect(signInButton).toBeEnabled();

    await user.clear(aliasField);
    expect(signInButton).toBeDisabled();

    await user.type(aliasField, "1");
    expect(signInButton).toBeEnabled();

    await user.clear(passwordField);
    expect(signInButton).toBeDisabled();
  });

  it("calls the presenter's login method with correct parameters when the sign-in button is pressed", async () => {
    const mockPresenter = mock<LoginPresenter>();
    const mockPresenterInstance = instance(mockPresenter);
    const originalUrl = "http://someurl.com";
    const alias = "@SomeAlias";
    const password = "myPassword";
    const { signInButton, aliasField, passwordField, user } =
      renderLoginAndGetElements(originalUrl, mockPresenterInstance);

    await user.type(aliasField, alias);
    await user.type(passwordField, password);
    await user.click(signInButton);

    verify(mockPresenter.doLogin(alias, password, false)).once();
  });
});

const renderLogin = (
  originalUrl: string,
  mockPresenterInstance?: LoginPresenter
) => {
  return render(
    <MemoryRouter>
      <Login
        originalUrl={originalUrl}
        presenterGenerator={(view: LoginView) =>
          mockPresenterInstance || new LoginPresenter(view)
        }
      />
    </MemoryRouter>
  );
};

const renderLoginAndGetElements = (
  originalUrl: string,
  mockPresenterInstance?: LoginPresenter
) => {
  const user = userEvent.setup();

  renderLogin(originalUrl, mockPresenterInstance);

  const signInButton = screen.getByRole("button", { name: /Sign in/i });
  const aliasField = screen.getByLabelText("alias");
  const passwordField = screen.getByLabelText("password");

  return { signInButton, aliasField, passwordField, user };
};
