import { AuthToken, FollowRelatedRequest, User } from "tweeter-shared";
import FollowService from "../model/service/FollowService";
import { InfoPresenter, InfoView } from "./InfoPresenter";

export interface UserInfoView extends InfoView {
  setIsFollower: (isFollower: boolean) => void;
  setFolloweeCount: (count: number) => void;
  setFollowerCount: (count: number) => void;
  setIsLoading: (isLoading: boolean) => void;
}

export class UserInfoPresenter extends InfoPresenter<
  FollowService,
  UserInfoView
> {
  public constructor(view: UserInfoView) {
    super(view);
  }

  protected createService(): FollowService {
    return new FollowService();
  }

  setIsFollowerStatus = async (
    authToken: AuthToken,
    currentUser: User,
    displayedUser: User
  ) => {
    await this.doFailureReportingOperation(async () => {
      if (currentUser === displayedUser) {
        this.view.setIsFollower(false);
      } else {
        this.view.setIsFollower(
          await this.service.getIsFollowerStatus(
            authToken!,
            currentUser!,
            displayedUser!
          )
        );
      }
    }, "determine follower status");
  };

  setNumbFollowees = async (authToken: AuthToken, displayedUser: User) => {
    await this.doFailureReportingOperation(async () => {
      const request: FollowRelatedRequest = {
        token: authToken.token,
        user: displayedUser.dto,
      };
      this.view.setFolloweeCount(await this.service.getFolloweeCount(request));
    }, "get followees count");
  };

  setNumbFollowers = async (authToken: AuthToken, displayedUser: User) => {
    await this.doFailureReportingOperation(async () => {
      const request: FollowRelatedRequest = {
        token: authToken.token,
        user: displayedUser.dto,
      };
      this.view.setFollowerCount(await this.service.getFollowerCount(request));
    }, "get followers count");
  };

  followDisplayedUser = async (
    authToken: AuthToken,
    displayedUser: User
  ): Promise<void> => {
    await this.doFailureReportingOperation(async () => {
      this.view.setIsLoading(true);
      this.view.displayInfoMessage(`Following ${displayedUser!.name}...`, 0);

      const request: FollowRelatedRequest = {
        token: authToken.token,
        user: displayedUser.dto,
      };

      const [followerCount, followeeCount] = await this.service.follow(request);

      this.view.setIsFollower(true);
      this.view.setFollowerCount(followerCount);
      this.view.setFolloweeCount(followeeCount);
    }, "follow user");
    this.view.clearLastInfoMessage();
    this.view.setIsLoading(false);
  };

  public async unfollowDisplayedUser(
    authToken: AuthToken,
    displayedUser: User
  ): Promise<void> {
    await this.doFailureReportingOperation(async () => {
      this.view.setIsLoading(true);
      this.view.displayInfoMessage(`Unfollowing ${displayedUser!.name}...`, 0);

      const request: FollowRelatedRequest = {
        token: authToken.token,
        user: displayedUser.dto,
      };

      const [followerCount, followeeCount] = await this.service.unfollow(
        request
      );

      this.view.setIsFollower(false);
      this.view.setFollowerCount(followerCount);
      this.view.setFolloweeCount(followeeCount);
    }, "unfollow user");
    this.view.clearLastInfoMessage();
    this.view.setIsLoading(false);
  }
}
