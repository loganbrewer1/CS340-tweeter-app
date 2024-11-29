import {
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
  QueryCommand,
  DeleteCommand,
} from "@aws-sdk/lib-dynamodb";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";

export class FollowDAO {
  readonly tableName = "Follow";
  readonly pkAttr = "followerAlias";
  readonly skAttr = "followeeAlias";

  private readonly client = DynamoDBDocumentClient.from(new DynamoDBClient());

  async addFollow(followerAlias: string, followeeAlias: string): Promise<void> {
    const params = {
      TableName: this.tableName,
      Item: {
        [this.pkAttr]: followerAlias,
        [this.skAttr]: followeeAlias,
      },
    };
    await this.client.send(new PutCommand(params));
  }

  async removeFollow(
    followerAlias: string,
    followeeAlias: string
  ): Promise<void> {
    const params = {
      TableName: this.tableName,
      Key: {
        [this.pkAttr]: followerAlias,
        [this.skAttr]: followeeAlias,
      },
    };
    await this.client.send(new DeleteCommand(params));
  }

  async getFollowees(followerAlias: string): Promise<string[]> {
    const params = {
      TableName: this.tableName,
      KeyConditionExpression: `${this.pkAttr} = :follower`,
      ExpressionAttributeValues: {
        ":follower": followerAlias,
      },
    };

    const output = await this.client.send(new QueryCommand(params));
    return output.Items?.map((item) => item[this.skAttr]) || [];
  }

  async getFollowers(followeeAlias: string): Promise<string[]> {
    const params = {
      TableName: this.tableName,
      IndexName: "followeeAliasIndex",
      KeyConditionExpression: `${this.skAttr} = :followee`,
      ExpressionAttributeValues: {
        ":followee": followeeAlias,
      },
    };

    const output = await this.client.send(new QueryCommand(params));
    return output.Items?.map((item) => item[this.pkAttr]) || [];
  }
}
