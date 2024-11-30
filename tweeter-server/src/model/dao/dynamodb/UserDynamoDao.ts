import {
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
  BatchGetCommand,
} from "@aws-sdk/lib-dynamodb";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { User, UserDto } from "tweeter-shared";
import { UserDAO } from "../interfaces/UserDAO";

export class UserDynamoDAO implements UserDAO {
  readonly tableName = "User";
  readonly pkAttr = "alias";

  private readonly client = DynamoDBDocumentClient.from(new DynamoDBClient());

  async getUser(alias: string): Promise<User | null> {
    const params = {
      TableName: this.tableName,
      Key: {
        [this.pkAttr]: alias,
      },
    };

    const output = await this.client.send(new GetCommand(params));

    if (!output.Item) {
      return null;
    }

    const dto: UserDto = {
      alias: output.Item.alias,
      imageUrl: output.Item.imageUrl,
      firstName: output.Item.firstname,
      lastName: output.Item.lastname,
    };

    return User.fromDto(dto);
  }

  async createUser(newUser: User): Promise<void> {
    const params = {
      TableName: this.tableName,
      Item: {
        [this.pkAttr]: newUser.alias,
        imageUrl: newUser.imageUrl,
        firstname: newUser.firstName,
        lastname: newUser.lastName,
      },
    };
    await this.client.send(new PutCommand(params));
  }

  async batchGetUsersByAliases(aliases: Set<string>): Promise<User[]> {
    if (aliases && aliases.size === 0) {
      return [];
    }

    const aliasArray = Array.from(aliases);

    const keys = aliasArray.map<Record<string, {}>>((alias) => ({
      [this.pkAttr]: alias,
    }));

    const params = {
      RequestItems: {
        [this.tableName]: {
          Keys: keys,
        },
      },
    };

    const result = await this.client.send(new BatchGetCommand(params));

    if (result.Responses) {
      return result.Responses[this.tableName].map<User>(
        (item) =>
          User.fromDto({
            alias: item[this.pkAttr],
            imageUrl: item.imageUrl,
            firstName: item.firstName,
            lastName: item.lastName,
          })!
      );
    } else {
      return [];
    }
  }
}
