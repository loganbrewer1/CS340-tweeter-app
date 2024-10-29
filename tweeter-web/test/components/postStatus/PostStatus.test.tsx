import React from "react";
import { MemoryRouter } from "react-router-dom";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  PostStatusView,
  PostStatusPresenter,
} from "../../../src/presenters/PostStatusPresenter";
import "@testing-library/jest-dom";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fab } from "@fortawesome/free-brands-svg-icons";
import { mock, instance, verify } from "ts-mockito";
import PostStatus from "../../../src/components/postStatus/PostStatus";
import useUserInfo from "../../../src/components/userInfo/UserInfoHook";
import { AuthToken, User } from "tweeter-shared";

library.add(fab);

jest.mock("../../../src/components/userInfo/UserInfoHook", () => ({
  ...jest.requireActual("../../../src/components/userInfo/UserInfoHook"),
  __esModule: true,
  default: jest.fn(),
}));

describe("Login Component", () => {
  const mockUserInstance: User = new User(
    "Frodo",
    "Baggins",
    "@frodo",
    "https://someUrl"
  );
  const mockAuthTokenInstance: AuthToken = new AuthToken(
    "holygrail",
    Date.now()
  );
  beforeAll(() => {
    (useUserInfo as jest.Mock).mockReturnValue({
      currentUser: mockUserInstance,
      authToken: mockAuthTokenInstance,
    });
  });

  it("starts with the submit button and clear button disabled", () => {
    const { clearButton, postStatusButton } = renderPostStatusAndGetElements();
    expect(clearButton).toBeDisabled();
    expect(postStatusButton).toBeDisabled();
  });

  it("has both buttons enabled when the text field has text.", async () => {
    const { clearButton, postStatusButton, postField, user } =
      renderPostStatusAndGetElements();

    await user.type(postField, "full AP bard is the only way to play");
    expect(postStatusButton).toBeEnabled;
    expect(clearButton).toBeEnabled;
  });

  it("has both buttons disable when the test field is cleared", async () => {
    const { clearButton, postStatusButton, postField, user } =
      renderPostStatusAndGetElements();

    await user.type(postField, "you like jazz?");
    await user.click(clearButton);

    expect(clearButton).toBeDisabled();
    expect(postStatusButton).toBeDisabled();
  });

  it("has the presenter's postStatus method called with correct parameters when the post status button is pressed", async () => {
    const mockPresenter = mock<PostStatusPresenter>();
    const mockPresenterInstance = instance(mockPresenter);
    const { postStatusButton, postField, user } =
      renderPostStatusAndGetElements(mockPresenterInstance);

    await user.type(postField, "you like jazz?");
    await user.click(postStatusButton);

    verify(
      mockPresenter.submitPost(
        "you like jazz?",
        mockUserInstance,
        mockAuthTokenInstance
      )
    ).once();
  });
});

const renderPostStatusAndGetElements = (
  mockPresenterInstance?: PostStatusPresenter
) => {
  const user = userEvent.setup();

  renderPostStatus(mockPresenterInstance);

  const postStatusButton = screen.getByRole("button", { name: /status/i });
  const clearButton = screen.getByRole("button", { name: /clear/i });
  const postField = screen.getByLabelText("post");

  return { postStatusButton, clearButton, postField, user };
};

const renderPostStatus = (mockPresenterInstance?: PostStatusPresenter) => {
  return render(
    <MemoryRouter>
      <PostStatus
        presenterGenerator={(view: PostStatusView) =>
          mockPresenterInstance || new PostStatusPresenter(view)
        }
      />
    </MemoryRouter>
  );
};
