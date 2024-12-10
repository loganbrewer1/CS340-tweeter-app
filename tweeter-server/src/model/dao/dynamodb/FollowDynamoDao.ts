import {
  DynamoDBDocumentClient,
  PutCommand,
  QueryCommand,
  DeleteCommand,
  QueryCommandInput,
} from "@aws-sdk/lib-dynamodb";
import { DynamoDBClient, QueryCommandOutput } from "@aws-sdk/client-dynamodb";
import { FollowDAO } from "../interfaces/FollowDAO";
import UserDynamoDAO from "./UserDynamoDAO";
import { UserDto } from "tweeter-shared";

export class FollowDynamoDAO implements FollowDAO {
  readonly tableName = "Follow";
  readonly pkAttr = "followerAlias";
  readonly skAttr = "followeeAlias";

  private readonly client = DynamoDBDocumentClient.from(new DynamoDBClient());
  private readonly userDynamoDAO = new UserDynamoDAO();

  async followUser(
    followerAlias: string,
    followeeAlias: string
  ): Promise<void> {
    const params = {
      TableName: this.tableName,
      Item: {
        [this.pkAttr]: followerAlias,
        [this.skAttr]: followeeAlias,
      },
    };
    await this.client.send(new PutCommand(params));
  }

  async unfollowUser(
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

  async getFollowees(
    followerAlias: string,
    limit: number,
    exclusiveStartKey?: string
  ): Promise<{ followees: UserDto[]; hasMore: boolean }> {
    const params: any = {
      TableName: this.tableName,
      KeyConditionExpression: `${this.pkAttr} = :follower`,
      ExpressionAttributeValues: {
        ":follower": followerAlias,
      },
      Limit: limit,
      ExclusiveStartKey: exclusiveStartKey,
    };

    const output = await this.client.send(new QueryCommand(params));
    const followeeAliases =
      output.Items?.map((item) => item[this.skAttr]) || [];

    const userDtos = await this.userDynamoDAO.getBatchUsersByAliases(
      followeeAliases
    );

    const hasMore = output.LastEvaluatedKey !== undefined;

    return { followees: userDtos, hasMore };
  }

  async getFolloweeCount(followerAlias: string): Promise<number> {
    const params: QueryCommandInput = {
      TableName: this.tableName,
      KeyConditionExpression: `${this.pkAttr} = :follower`,
      ExpressionAttributeValues: {
        ":follower": followerAlias,
      },
      Select: "COUNT",
    };

    const output = await this.client.send(new QueryCommand(params));
    return output.Count || 0;
  }

  async getFollowers(
    followeeAlias: string,
    limit: number,
    exclusiveStartKey?: string
  ): Promise<{ users: UserDto[]; hasMore: boolean }> {
    const params: any = {
      TableName: this.tableName,
      IndexName: "followeeAliasIndex",
      KeyConditionExpression: `${this.skAttr} = :followee`,
      ExpressionAttributeValues: {
        ":followee": followeeAlias,
      },
      Limit: limit,
      ExclusiveStartKey: exclusiveStartKey,
    };

    const output = await this.client.send(new QueryCommand(params));
    const followerAliases =
      output.Items?.map((item) => item[this.pkAttr]) || [];

    const userDtos = await this.userDynamoDAO.getBatchUsersByAliases(
      followerAliases
    );

    const hasMore = output.LastEvaluatedKey !== undefined;

    return { users: userDtos, hasMore };
  }

  async getFollowerCount(followeeAlias: string): Promise<number> {
    const params: QueryCommandInput = {
      TableName: this.tableName,
      IndexName: "followeeAliasIndex",
      KeyConditionExpression: `${this.skAttr} = :followee`,
      ExpressionAttributeValues: {
        ":followee": followeeAlias,
      },
      Select: "COUNT",
    };

    const output = await this.client.send(new QueryCommand(params));
    return output.Count || 0;
  }

  public async isFollower(
    followerAlias: string,
    followeeAlias: string
  ): Promise<boolean> {
    const params = {
      TableName: this.tableName,
      IndexName: "followeeAliasIndex",
      KeyConditionExpression:
        "#followeeAlias = :followeeAlias AND #followerAlias = :followerAlias",
      ExpressionAttributeNames: {
        "#followeeAlias": this.skAttr,
        "#followerAlias": this.pkAttr,
      },
      ExpressionAttributeValues: {
        ":followeeAlias": followeeAlias,
        ":followerAlias": followerAlias,
      },
    };

    const output: QueryCommandOutput = await this.client.send(
      new QueryCommand(params)
    );

     return output.Items ? output.Items.length > 0 : false;
  }
}
