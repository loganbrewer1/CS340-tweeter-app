import { User } from "tweeter-shared";

export interface UserDAO {
  createUser(user: User): Promise<void>;
  getUser(alias: string): Promise<User | null>;
  batchGetUsersByAliases(aliases: Set<string>): Promise<User[]>;
}
