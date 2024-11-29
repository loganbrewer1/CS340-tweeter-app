import {
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
  QueryCommand,
  DeleteCommand,
} from "@aws-sdk/lib-dynamodb";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";

export class StoryDAO {
  readonly tableName = "Story";
  readonly pkAttr = "senderAlias";
  readonly skAttr = "date";

  private readonly client = DynamoDBDocumentClient.from(new DynamoDBClient());

  async addStory(senderAlias: string, date: string): Promise<void> {
    const params = {
      TableName: this.tableName,
      Item: {
        [this.pkAttr]: senderAlias,
        [this.skAttr]: date,
      },
    };
    await this.client.send(new PutCommand(params));
  }

  async getStories(senderAlias: string): Promise<string[]> {
    const params = {
      TableName: this.tableName,
      KeyConditionExpression: `${this.pkAttr} = :sender`,
      ExpressionAttributeValues: {
        ":sender": senderAlias,
      },
    };

    const output = await this.client.send(new QueryCommand(params));
    return output.Items?.map((item) => item[this.skAttr]) || [];
  }
}
