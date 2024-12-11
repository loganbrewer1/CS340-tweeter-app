import { SQSClient, SendMessageCommand } from "@aws-sdk/client-sqs";

const sqsClient = new SQSClient();

export const handler = async (event: any): Promise<void> => {
  for (const record of event.Records) {
    const message = JSON.parse(record.body);
    const { token, newStatus } = message;

    try {
      await sqsClient.send(
        new SendMessageCommand({
          QueueUrl:
            "https://sqs.us-west-2.amazonaws.com/011528258727/feedUpdateQueue",
          MessageBody: JSON.stringify({ token, newStatus }),
        })
      );
      console.log("Message sent to FeedUpdateQueue");
    } catch (error) {
      console.error("Error sending message to FeedUpdateQueue", error);
    }
  }
};
