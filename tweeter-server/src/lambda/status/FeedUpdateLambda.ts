import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  BatchWriteCommand,
} from "@aws-sdk/lib-dynamodb";

const dynamoClient = DynamoDBDocumentClient.from(new DynamoDBClient());
const feedTableName = "Feed";

export const handler = async (event: any) => {
  for (const record of event.Records) {
    const {
      status,
      followerAliases,
    }: { status: any; followerAliases: string[] } = JSON.parse(record.body);

    const feedItems = followerAliases.map((alias: string) => ({
      PutRequest: {
        Item: {
          receiverAlias: alias,
          dateAndSenderAlias: `${status.timestamp}#${status.user.alias}`,
          statusDto: status,
        },
      },
    }));

    await dynamoClient.send(
      new BatchWriteCommand({
        RequestItems: {
          [feedTableName]: feedItems,
        },
      })
    );
  }
};
