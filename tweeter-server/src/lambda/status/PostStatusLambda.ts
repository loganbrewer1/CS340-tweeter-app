import { PostStatusRequest, TweeterResponse } from "tweeter-shared";
import StatusService from "../../model/service/StatusService";
import { FeedDynamoDAO } from "../../model/dao/dynamodb/FeedDynamoDAO";
import { StoryDynamoDAO } from "../../model/dao/dynamodb/StoryDynamoDAO";
import { AuthTokenDynamoDAO } from "../../model/dao/dynamodb/AuthTokenDynamoDAO";
import { SendMessageCommand, SQSClient } from "@aws-sdk/client-sqs";

const sqsClient = new SQSClient();

export const handler = async (
  request: PostStatusRequest
): Promise<TweeterResponse> => {
  const statusService = new StatusService(
    new FeedDynamoDAO(),
    new StoryDynamoDAO(),
    new AuthTokenDynamoDAO()
  );

  const messageBody = JSON.stringify({
    token: request.token,
    newStatus: request.newStatus,
  });

  await sqsClient.send(
    new SendMessageCommand({
      QueueUrl:
        "https://sqs.us-west-2.amazonaws.com/011528258727/statusFanOutQueue",
      MessageBody: messageBody,
    })
  );

  return {
    success: true,
    message: null,
  };
};
