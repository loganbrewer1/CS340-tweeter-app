import {
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
  BatchGetCommand,
} from "@aws-sdk/lib-dynamodb";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { UserDto } from "tweeter-shared";
import { UserDAO } from "../interfaces/UserDAO";

export class UserDynamoDAO implements UserDAO {
  readonly tableName = "User";
  readonly pkAttr = "alias";

  private readonly client = DynamoDBDocumentClient.from(new DynamoDBClient());

  async createUser(userDto: UserDto, hashedPassword: string): Promise<void> {
    const params = {
      TableName: this.tableName,
      Item: {
        [this.pkAttr]: userDto.alias,
        userDto: userDto,
        password: hashedPassword
      },
    };
    await this.client.send(new PutCommand(params));
  }

  async getUser(alias: string): Promise<[UserDto, string] | null> {
    const params = {
      TableName: this.tableName,
      Key: {
        [this.pkAttr]: alias,
      },
    };

    const output = await this.client.send(new GetCommand(params));
    if (output.Item) {
      return [output.Item.userDto, output.Item.password];
    }
    return null;
  }

  async getBatchUsersByAliases(aliases: string[]): Promise<UserDto[]> {
    const params = {
      RequestItems: {
        [this.tableName]: {
          Keys: aliases.map((alias) => ({ [this.pkAttr]: alias })),
        },
      },
    };

    const output = await this.client.send(new BatchGetCommand(params));
    const userDtos: UserDto[] = [];

    output.Responses?.[this.tableName]?.forEach((item) => {
      if (item.userDto) {
        userDtos.push(item.userDto);
      }
    });

    return userDtos;
  }
}

export default UserDynamoDAO;
