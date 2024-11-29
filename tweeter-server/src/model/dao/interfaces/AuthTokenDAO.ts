export interface AuthTokenDAO {
  createAuthToken(token: string, userAlias: string): Promise<void>;
  validateAuthToken(token: string): Promise<boolean>;
  deleteAuthToken(token: string): Promise<void>;
}
