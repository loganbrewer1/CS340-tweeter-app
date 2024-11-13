import {
  mock,
  instance,
  spy,
  when,
  verify,
  capture,
  anything,
} from "ts-mockito";
import StatusService from "../../src/model/service/StatusService";
import {
  PostStatusPresenter,
  PostStatusView,
} from "../../src/presenters/PostStatusPresenter";
import { User, AuthToken, Status, PostStatusRequest } from "tweeter-shared";

describe("PostStatusPresenter", () => {
  let postStatusPresenter: PostStatusPresenter;
  let mockPostStatusView: PostStatusView;
  let mockStatusService: StatusService;

  const mockPost = "Hello world!";
  const mockUser = new User("Logan", "Brewer", "Hombre", "hotPicture");
  const authToken = new AuthToken("WubbaDubbaGingGong", Date.now());
  const request: PostStatusRequest = {
    token: authToken.token,
    newStatus: {
      post: mockPost,
      user: mockUser,
      timestamp: Date.now(),
      segments: [
        {
          text: mockPost,
          startPosition: 0,
          endPosition: 12,
          type: "text"
        },
      ],
    },
  };

  beforeEach(() => {
    mockPostStatusView = mock<PostStatusView>();
    const mockPostStatusViewInstance = instance(mockPostStatusView);

    const postStatusPresenterSpy = spy(
      new PostStatusPresenter(mockPostStatusViewInstance)
    );
    postStatusPresenter = instance(postStatusPresenterSpy);

    mockStatusService = mock<StatusService>();
    const mockStatusServiceInstance = instance(mockStatusService);

    when(postStatusPresenterSpy.service).thenReturn(mockStatusServiceInstance);
  });

  it("tells the view to display a posting status message", async () => {
    await postStatusPresenter.submitPost(mockPost, mockUser, authToken);
    verify(
      mockPostStatusView.displayInfoMessage("Posting status...", 0)
    ).once();
  });

  it("calls postStatus on the post status service with the correct status string and auth token", async () => {
    await postStatusPresenter.submitPost(mockPost, mockUser, authToken);
    verify(mockStatusService.postStatus(request)).once();

    const [capturedAuthToken, capturedStatus] = capture(
      mockStatusService.postStatus
    ).last();
    expect(capturedAuthToken).toBe(authToken);
    // expect(capturedStatus.post).toBe(mockPost);
  });

  it("tells the view to clear the last info message, clear the post, and display a status posted message", async () => {
    await postStatusPresenter.submitPost(mockPost, mockUser, authToken);
    verify(mockPostStatusView.clearLastInfoMessage()).once;
    verify(mockPostStatusView.setPost("")).once;
    verify(mockPostStatusView.displayInfoMessage("Posting status...", 0)).once;
  });

  it("tells the view to display an error message and clear the last info message and does not tell it to clear the post or display a status posted message", async () => {
    const error = new Error("An error occurred");
    when(mockStatusService.postStatus(request)).thenThrow(error);

    await postStatusPresenter.submitPost(mockPost, mockUser, authToken);

    verify(
      mockPostStatusView.displayErrorMessage(
        "Failed to post the status because of exception: An error occurred"
      )
    ).once();

    verify(
      mockPostStatusView.displayInfoMessage("Posting status...", 0)
    ).never();
    verify(mockPostStatusView.setPost("")).never();
  });
});
