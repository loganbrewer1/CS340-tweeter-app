import {
  DynamoDBDocumentClient,
  PutCommand,
  QueryCommand,
} from "@aws-sdk/lib-dynamodb";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { FeedDAO } from "../interfaces/FeedDAO";
import { Status, StatusDto } from "tweeter-shared";
import { FollowDynamoDAO } from "./FollowDynamoDAO";

export class FeedDynamoDAO implements FeedDAO {
  readonly tableName = "Feed";
  readonly pkAttr = "receiverAlias";
  readonly skAttr = "dateAndSenderAlias";

  private readonly client = DynamoDBDocumentClient.from(new DynamoDBClient());
  private readonly followDynamoDAO = new FollowDynamoDAO();

  async addStatusToFeeds(
    receiverAlias: string,
    newStatus: Status
  ): Promise<void> {
    const followers = await this.followDynamoDAO.getFollowers(receiverAlias);

    for (const follower of followers) {
      const dateAndSenderAlias = `${newStatus.timestamp}#${newStatus.user.alias}`;
      await this.addFeedItem(
        follower,
        dateAndSenderAlias,
        newStatus.user.alias
      );
    }
  }

  private async addFeedItem(
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

  async getFeedForUser(
    receiverAlias: string,
    lastItemTimestamp?: string,
    pageSize: number = 10
  ): Promise<[Status[], boolean]> {
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

    const statuses: Status[] =
      (output.Items?.map((item) => {
        const statusDto: StatusDto = {
          post: item.post,
          user: {
            alias: receiverAlias,
            imageUrl: item.imageUrl,
            firstName: item.firstName,
            lastName: item.lastName,
          },
          timestamp: item[this.skAttr]?.split("#")[0],
          segments: item.segments || [],
        };

        return Status.fromDto(statusDto);
      })! as Status[]) || [];

    const hasMorePages = output.LastEvaluatedKey !== undefined;
    return [statuses, hasMorePages];
  }
}
