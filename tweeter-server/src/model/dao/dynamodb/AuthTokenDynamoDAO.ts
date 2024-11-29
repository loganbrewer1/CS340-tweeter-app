import {
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
  QueryCommand,
  DeleteCommand,
} from "@aws-sdk/lib-dynamodb";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";

export class AuthTokenDAO {
  readonly tableName = "AuthToken";
  readonly pkAttr = "token";

  private readonly client = DynamoDBDocumentClient.from(new DynamoDBClient());

  async storeToken(token: string, ttl: number): Promise<void> {
    const params = {
      TableName: this.tableName,
      Item: {
        [this.pkAttr]: token,
        ttl,
      },
    };
    await this.client.send(new PutCommand(params));
  }

  async validateToken(token: string): Promise<boolean> {
    const params = {
      TableName: this.tableName,
      Key: {
        [this.pkAttr]: token,
      },
    };

    const output = await this.client.send(new GetCommand(params));
    return !!output.Item;
  }

  async deleteToken(token: string): Promise<void> {
    const params = {
      TableName: this.tableName,
      Key: {
        [this.pkAttr]: token,
      },
    };
    await this.client.send(new DeleteCommand(params));
  }
}
