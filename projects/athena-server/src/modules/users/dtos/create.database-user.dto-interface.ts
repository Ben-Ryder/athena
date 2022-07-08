

export interface CreateDatabaseUserDto {
  username: string;
  email: string;
  encryptionSecret: string;
  passwordHash: string;
}