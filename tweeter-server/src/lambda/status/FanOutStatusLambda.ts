import { SQSClient, SendMessageCommand } from "@aws-sdk/client-sqs";
import { FollowDynamoDAO } from "../../model/dao/dynamodb/FollowDynamoDAO";
// import { fromIni } from "@aws-sdk/credential-providers";

// let sqsClient = new SQSClient({
//   credentials: fromIni({ profile: "personal" }),
//   region: "us-west-2",
// });

const sqsClient = new SQSClient();
const feedUpdateQueueUrl =
  "https://sqs.us-west-2.amazonaws.com/011528258727/feedUpdateQueue";
const followDynamoDAO = new FollowDynamoDAO();

export const handler = async (event: any) => {
  for (const record of event.Records) {
    const { status, receiverAlias } = JSON.parse(record.body);
    let lastEvaluatedKey: string | undefined = undefined;
    let hasMoreFollowers = true;

    while (hasMoreFollowers) {
      const result = await followDynamoDAO.getFollowers(
        receiverAlias,
        25,
        lastEvaluatedKey
      );

      const chunk = {
        status,
        followerAliases: result.users.map((user) => user.alias),
      };

      await sqsClient.send(
        new SendMessageCommand({
          QueueUrl: feedUpdateQueueUrl,
          MessageBody: JSON.stringify(chunk),
        })
      );

      lastEvaluatedKey = result.hasMore ? lastEvaluatedKey : undefined;
      hasMoreFollowers = result.hasMore;
    }
  }
};
