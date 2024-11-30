import {
  DynamoDBDocumentClient,
  PutCommand,
  QueryCommand,
} from "@aws-sdk/lib-dynamodb";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { StoryDAO } from "../interfaces/StoryDAO";
import { StatusDto } from "tweeter-shared";

export class StoryDynamoDAO implements StoryDAO {
  readonly tableName = "Story";
  readonly pkAttr = "senderAlias";
  readonly skAttr = "date";

  private readonly client = DynamoDBDocumentClient.from(new DynamoDBClient());

  async addStory(senderAlias: string, statusDto: StatusDto): Promise<void> {
    const params = {
      TableName: this.tableName,
      Item: {
        [this.pkAttr]: senderAlias,
        [this.skAttr]: statusDto.timestamp,
        statusDto,
      },
    };
    await this.client.send(new PutCommand(params));
  }

  async getUserStories(
    senderAlias: string,
    lastItemTimestamp?: number,
    pageSize?: number
  ): Promise<[StatusDto[], boolean]> {
    const params = {
      TableName: this.tableName,
      KeyConditionExpression: `${this.pkAttr} = :sender`,
      ExpressionAttributeValues: {
        ":sender": senderAlias,
      },
      Limit: pageSize,
      ExclusiveStartKey: lastItemTimestamp
        ? {
            [this.pkAttr]: senderAlias,
            [this.skAttr]: lastItemTimestamp,
          }
        : undefined,
    };

    const output = await this.client.send(new QueryCommand(params));

    const statusDtos = output.Items?.map((item) => item.statusDto) || [];

    const hasMorePages = output.LastEvaluatedKey !== undefined;
    return [statusDtos, hasMorePages];
  }
}
