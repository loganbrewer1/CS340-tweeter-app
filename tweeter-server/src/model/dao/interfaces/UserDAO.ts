import { User } from "tweeter-shared";

export interface UserDAO {
  createUser(user: User): Promise<void>;
  getUserByAlias(alias: string): Promise<User | null>;
  batchGetUsersByAliases(aliases: string[]): Promise<User[]>;
  updateUserImage(alias: string, imageUrl: string): Promise<void>;
}
