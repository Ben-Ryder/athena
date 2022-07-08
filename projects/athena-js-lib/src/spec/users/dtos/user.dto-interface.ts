export interface UserDto {
  id: string;
  username: string;
  email: string;
  encryptionSecret: string;
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}