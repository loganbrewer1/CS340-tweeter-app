import { AuthToken, User } from "tweeter-shared";
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
      this.view.setFolloweeCount(
        await this.service.getFolloweeCount(authToken, displayedUser)
      );
    }, "get followees count");
  };

  setNumbFollowers = async (authToken: AuthToken, displayedUser: User) => {
    await this.doFailureReportingOperation(async () => {
      this.view.setFollowerCount(
        await this.service.getFollowerCount(authToken, displayedUser)
      );
    }, "get followers count");
  };

  followDisplayedUser = async (
    authToken: AuthToken,
    displayedUser: User
  ): Promise<void> => {
    await this.doFailureReportingOperation(async () => {
      this.view.setIsLoading(true);
      this.view.displayInfoMessage(`Following ${displayedUser!.name}...`, 0);

      const [followerCount, followeeCount] = await this.service.follow(
        authToken!,
        displayedUser!
      );

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

      const [followerCount, followeeCount] = await this.service.unfollow(
        authToken!,
        displayedUser!
      );

      this.view.setIsFollower(false);
      this.view.setFollowerCount(followerCount);
      this.view.setFolloweeCount(followeeCount);
    }, "unfollow user");
    this.view.clearLastInfoMessage();
    this.view.setIsLoading(false);
  }
}
