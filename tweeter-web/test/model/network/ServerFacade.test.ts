import "isomorphic-fetch";
import { ServerFacade } from "../../../src/model/network/ServerFacade";
import {
  RegisterRequest,
  FollowRelatedRequest,
  PagedUserItemRequest,
  AuthToken,
  UserDto,
} from "tweeter-shared";

describe("ServerFacade Integration Tests", () => {
  let facade: ServerFacade;
  let testUser: UserDto = {
    firstName: "Bo",
    lastName: "Staff",
    alias: "skills",
    imageUrl: "HowToImpressAWoman",
  };

  beforeAll(() => {
    facade = new ServerFacade();
  });

  test("Register user", async () => {
    const request: RegisterRequest = {
      alias: "Please",
      password: "Nerf",
      firstName: "Darius",
      lastName: "And",
      userImageBytes: "Katarina",
      imageFileExtension: "Buff",
      token: "Bard",
    };
    const [user, authToken] = await facade.register(request);
    expect(user).not.toBeNull();
    expect(authToken).toBeInstanceOf(AuthToken);
  });

  test("Get Follower Count", async () => {
    const request: FollowRelatedRequest = {
      user: testUser,
      token: "bilboBaggins",
    };
    const count = await facade.getFollowerCount(request);
    expect(count).toBeGreaterThanOrEqual(1);
  });

  test("Get More Followers", async () => {
    const request: PagedUserItemRequest = {
      userAlias: "LordSauron",
      token: "theRingHarry",
      pageSize: 10,
      lastItem: null,
    };
    const [followers, hasMore] = await facade.getMoreFollowers(request);
    expect(followers.length).toBeGreaterThan(0);
  });
});
