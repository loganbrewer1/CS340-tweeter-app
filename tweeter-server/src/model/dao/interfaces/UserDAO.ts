import { UserDto } from "tweeter-shared";

export interface UserDAO {
  createUser(user: UserDto, hashedPassword: string): Promise<void>;
  getUser(alias: string): Promise<[UserDto, string] | null>;
  getBatchUsersByAliases(aliases: string[]): Promise<UserDto[]>;
}
