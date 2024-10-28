import { mock, instance, spy, when, verify } from "ts-mockito";
import StatusService from "../../src/model/service/StatusService";
import {
  PostStatusPresenter,
  PostStatusView,
} from "../../src/presenters/PostStatusPresenter";
import { User, AuthToken, Status } from "tweeter-shared";

describe("PostStatusPresenter", () => {
  let postStatusPresenter: PostStatusPresenter;
  let mockPostStatusView: PostStatusView;
  let mockStatusService: StatusService;

  const mockEvent = new MouseEvent("click") as unknown as React.MouseEvent;
  const mockPost = "Hello world!";
  const mockUser = new User("Logan", "Brewer", "Hombre", "hotPicture");
  const authToken = new AuthToken("WubbaDubbaGingGong", Date.now());

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

  it("tells the view to display a posting status message", () => {
    postStatusPresenter.submitPost(mockEvent, mockPost, mockUser, authToken);
    verify( mockPostStatusView.displayInfoMessage("Posting status...", 0)).once();
  });

  it("calls postStatus on the post status service with the correct status string and auth token", () => {
    postStatusPresenter.submitPost(mockEvent, mockPost, mockUser, authToken);
    verify( mockStatusService.postStatus(authToken, new Status(mockPost, mockUser, Date.now()))).once()
  })

});
