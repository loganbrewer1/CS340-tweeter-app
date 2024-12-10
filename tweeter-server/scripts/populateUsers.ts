import { UserDto } from "tweeter-shared";
import { FollowDynamoDAO } from "../src/model/dao/dynamodb/FollowDynamoDAO";
import UserDynamoDAO from "../src/model/dao/dynamodb/UserDynamoDAO";
import { FollowDAO } from "../src/model/dao/interfaces/FollowDAO";
import { UserDAO } from "../src/model/dao/interfaces/UserDAO";

// Delay function to throttle requests
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const userDAO: UserDAO = new UserDynamoDAO();
const followDAO: FollowDAO = new FollowDynamoDAO();

// Commented out since users are already created
/*
async function createUser(alias: string): Promise<void> {
  const user: UserDto = {
    alias,
    firstName: `First${alias}`,
    lastName: `Last${alias}`,
    imageUrl: `https://example.com/${alias}.jpg`,
  };

  const password = "superdupersecurepassword";
  await userDAO.createUser(user, password);
}
*/

// Batch method to follow users in batches of 25
async function batchFollowUsers(
  targetAlias: string,
  followerAliases: string[]
): Promise<void> {
  const batchLimit = 25;
  const followerBatches = [];

  for (let i = 0; i < followerAliases.length; i += batchLimit) {
    const batch = followerAliases.slice(i, i + batchLimit);
    followerBatches.push(batch);
  }

  for (const batch of followerBatches) {
    const followPromises = batch.map(async (followerAlias) => {
      try {
        // Follow user in batch
        await followDAO.followUser(targetAlias, followerAlias);
        console.log(`Follower ${followerAlias} added to ${targetAlias}`);
      } catch (error) {
        console.error(`Error adding follower ${followerAlias}:`, error);
      }
    });

    await Promise.all(followPromises);

    await delay(1500);
  }
}

async function populateData(): Promise<void> {
  console.log("Starting data population...");

  const totalUsers = 10000;
  const targetUserAlias = "@Bard";

  console.log(`Target user: ${targetUserAlias}`);
  //await createUser(targetUserAlias); // Target user is already created in DynamoDB

  console.log(`Adding ${totalUsers} followers to ${targetUserAlias}...`);
  const followerAliases = Array.from(
    { length: totalUsers },
    (_, i) => `@user${i + 1}`
  );

  const startIndex = 7944;
  const batchFollowers = followerAliases.slice(startIndex);

  await batchFollowUsers(targetUserAlias, batchFollowers);

  console.log("Data population complete.");
}

populateData()
  .then(() => console.log("Script completed successfully."))
  .catch((error) => console.error("Error populating data:", error));
