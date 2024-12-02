export interface AuthTokenDAO {
  createAuthToken(userAlias: string): Promise<string>;
  doesAuthTokenExist(token: string): Promise<string | null>;
  deleteAuthToken(token: string): Promise<void>;
}
