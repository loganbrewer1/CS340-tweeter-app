import {
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
  QueryCommand,
  DeleteCommand,
} from "@aws-sdk/lib-dynamodb";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";

export class FeedDAO {
  readonly tableName = "Feed";
  readonly pkAttr = "receiverAlias";
  readonly skAttr = "dateAndSenderAlias";

  private readonly client = DynamoDBDocumentClient.from(new DynamoDBClient());

  async addFeedItem(
    receiverAlias: string,
    dateAndSenderAlias: string,
    senderAlias: string
  ): Promise<void> {
    const params = {
      TableName: this.tableName,
      Item: {
        [this.pkAttr]: receiverAlias,
        [this.skAttr]: dateAndSenderAlias,
        senderAlias,
      },
    };
    await this.client.send(new PutCommand(params));
  }

  async getFeed(receiverAlias: string): Promise<string[]> {
    const params = {
      TableName: this.tableName,
      KeyConditionExpression: `${this.pkAttr} = :receiver`,
      ExpressionAttributeValues: {
        ":receiver": receiverAlias,
      },
    };

    const output = await this.client.send(new QueryCommand(params));
    return output.Items?.map((item) => item.senderAlias) || [];
  }
}
