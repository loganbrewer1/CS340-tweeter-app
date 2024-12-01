import {
  DynamoDBDocumentClient,
  PutCommand,
  GetCommand,
  DeleteCommand,
} from "@aws-sdk/lib-dynamodb";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { v4 as uuidv4 } from "uuid";

export class AuthTokenDynamoDAO {
  readonly tableName = "AuthToken";
  readonly pkAttr = "token";

  private readonly client = DynamoDBDocumentClient.from(new DynamoDBClient());

  private generateAuthToken(): string {
    return uuidv4();
  }

  async createAuthToken(): Promise<string> {
    const authToken = this.generateAuthToken();
    const params = {
      TableName: this.tableName,
      Item: {
        [this.pkAttr]: authToken,
      },
    };
    await this.client.send(new PutCommand(params));

    return authToken;
  }

  async doesAuthTokenExist(authToken: string): Promise<boolean> {
    const params = {
      TableName: this.tableName,
      Key: {
        [this.pkAttr]: authToken,
      },
    };

    const output = await this.client.send(new GetCommand(params));
    return !!output.Item;
  }

  async deleteAuthToken(authToken: string): Promise<void> {
    const params = {
      TableName: this.tableName,
      Key: {
        [this.pkAttr]: authToken,
      },
    };
    await this.client.send(new DeleteCommand(params));
  }
}
