

export interface UpdateDatabaseUserDto {
  username?: string;
  email?: string;
  encryptionSecret?: string;
  passwordHash?: string;
  isVerified?: boolean;
}