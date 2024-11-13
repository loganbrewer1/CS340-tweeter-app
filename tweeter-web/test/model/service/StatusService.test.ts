import "isomorphic-fetch";
import { StatusService } from "../../../src/model/service/StatusService";
import { PagedStatusItemRequest } from "tweeter-shared";

describe("StatusService Integration Tests", () => {
  let statusService: StatusService;

  beforeAll(() => {
    statusService = new StatusService();
  });

  test("Retrieve user's stories", async () => {
    const request: PagedStatusItemRequest = {
      userAlias: "Napolean",
      token: "authToken",
      pageSize: 5,
      lastItem: null,
    };
    const [statuses, hasMore] = await statusService.loadMoreStoryItems(request);

    expect(statuses.length).toBeGreaterThan(0);
    expect(statuses[0]).toHaveProperty("post");
    expect(hasMore).toBe(true);
  });
});
