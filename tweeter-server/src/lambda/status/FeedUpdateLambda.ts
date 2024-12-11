import { FeedDynamoDAO } from "../../model/dao/dynamodb/FeedDynamoDAO";
import { StoryDynamoDAO } from "../../model/dao/dynamodb/StoryDynamoDAO";
import { AuthTokenDynamoDAO } from "../../model/dao/dynamodb/AuthTokenDynamoDAO";
import { StatusService } from "../../model/service/StatusService";

export const handler = async (event: any): Promise<void> => {
  for (const record of event.Records) {
    const message = JSON.parse(record.body);
    const { token, newStatus } = message;

    const statusService = new StatusService(
      new FeedDynamoDAO(),
      new StoryDynamoDAO(),
      new AuthTokenDynamoDAO()
    );

    try {
      await statusService.postStatus(token, newStatus);
      console.log("Status update processed successfully");
    } catch (error) {
      console.error("Error processing status update", error);
    }
  }
};
