import {
  DynamoDBDocumentClient,
  PutCommand,
  QueryCommand,
} from "@aws-sdk/lib-dynamodb";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { FeedDAO } from "../interfaces/FeedDAO";
import { StatusDto } from "tweeter-shared";
import { FollowDynamoDAO } from "./FollowDynamoDAO";

export class FeedDynamoDAO implements FeedDAO {
  readonly tableName = "Feed";
  readonly pkAttr = "receiverAlias";
  readonly skAttr = "dateAndSenderAlias";

  private readonly client = DynamoDBDocumentClient.from(new DynamoDBClient());
  private readonly followDynamoDAO = new FollowDynamoDAO();

  async addStatusToFeeds(
    receiverAlias: string,
    newStatusDto: StatusDto
  ): Promise<void> {
    const followers = await this.followDynamoDAO.getFollowers(receiverAlias);

    for (const follower of followers) {
      const dateAndSenderAlias = `${newStatusDto.timestamp}#${newStatusDto.user.alias}`;
      await this.addFeedItem(follower.alias, dateAndSenderAlias, newStatusDto);
    }
  }

  private async addFeedItem(
    receiverAlias: string,
    dateAndSenderAlias: string,
    newStatusDto: StatusDto
  ): Promise<void> {
    const params = {
      TableName: this.tableName,
      Item: {
        [this.pkAttr]: receiverAlias,
        [this.skAttr]: dateAndSenderAlias,
        statusDto: newStatusDto,
      },
    };
    await this.client.send(new PutCommand(params));
  }

  async getFeedForUser(
    receiverAlias: string,
    lastItemTimestamp?: string,
    pageSize: number = 10
  ): Promise<[StatusDto[], boolean]> {
    const params = {
      TableName: this.tableName,
      KeyConditionExpression: `${this.pkAttr} = :receiver`,
      ExpressionAttributeValues: {
        ":receiver": receiverAlias,
      },
      Limit: pageSize,
      ExclusiveStartKey: lastItemTimestamp
        ? {
            [this.pkAttr]: receiverAlias,
            [this.skAttr]: lastItemTimestamp,
          }
        : undefined,
    };

    const output = await this.client.send(new QueryCommand(params));

    const statusDtos: StatusDto[] =
      output.Items?.map((item) => item.statusDto) || [];

    const hasMorePages = output.LastEvaluatedKey !== undefined;
    return [statusDtos, hasMorePages];
  }
}
