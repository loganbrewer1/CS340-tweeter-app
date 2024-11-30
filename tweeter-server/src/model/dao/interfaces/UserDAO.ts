import { UserDto } from "tweeter-shared";

export interface UserDAO {
  createUser(user: UserDto): Promise<void>;
  getUser(alias: string): Promise<UserDto | null>;
  getBatchUsersByAliases(aliases: string[]): Promise<UserDto[]>;
}
