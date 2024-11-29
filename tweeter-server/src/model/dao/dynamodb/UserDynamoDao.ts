import {
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
  QueryCommand,
  DeleteCommand,
} from "@aws-sdk/lib-dynamodb";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { User, UserDto } from "tweeter-shared";

export class UserDynamoDAO {
  readonly tableName = "User";
  readonly pkAttr = "alias";

  private readonly client = DynamoDBDocumentClient.from(new DynamoDBClient());

  async getUser(
    alias: string
  ): Promise< UserDto | null> {
    const params = {
      TableName: this.tableName,
      Key: {
        [this.pkAttr]: alias,
      },
    };

    const output: UserDto = await this.client.send(new GetCommand(params));
    return output.Item || null;
  }

  async createUser(alias: string, image: string): Promise<void> {
    const params = {
      TableName: this.tableName,
      Item: {
        [this.pkAttr]: alias,
        image,
      },
    };
    await this.client.send(new PutCommand(params));
  }

  async updateUserImage(alias: string, image: string): Promise<void> {
    const params = {
      TableName: this.tableName,
      Key: {
        [this.pkAttr]: alias,
      },
      UpdateExpression: "SET image = :img",
      ExpressionAttributeValues: {
        ":img": image,
      },
    };
    await this.client.send(new UpdateCommand(params));
  }
}
