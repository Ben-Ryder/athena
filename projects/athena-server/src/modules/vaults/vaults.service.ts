import {AccessForbiddenError, Injectable} from "@kangojs/core";
import {VaultsDatabaseService} from "./database/vaults.database.service";
import {CreateVaultRequestSchema, GetVaultResponse, UpdateVaultRequestSchema, VaultDto} from "@ben-ryder/athena-js-lib";


@Injectable({
  identifier: "vaults-service"
})
export class VaultsService {
  constructor(
    private vaultsDatabaseService: VaultsDatabaseService
  ) {}

  async checkAccess(requestUserId: string, vaultId: string): Promise<void> {
    const vault = await this.vaultsDatabaseService.getWithUser(vaultId);

    if (vault.owner === requestUserId) {
      return;
    }

    throw new AccessForbiddenError({
      message: "Access forbidden to vault"
    })
  }

  async get(vaultId: string): Promise<GetVaultResponse> {
    return await this.vaultsDatabaseService.get(vaultId);
  }

  async getWithAccessCheck(requestUserId: string, vaultId: string): Promise<GetVaultResponse> {
    await this.checkAccess(requestUserId, vaultId);
    return this.get(vaultId);
  }

  async add(ownerId: string, createVaultDto: CreateVaultRequestSchema): Promise<VaultDto> {
    return await this.vaultsDatabaseService.create(ownerId, createVaultDto);
  }

  async update(vaultId: string, vaultUpdate: UpdateVaultRequestSchema): Promise<VaultDto> {
    return await this.vaultsDatabaseService.update(vaultId, vaultUpdate)
  }

  async updateWithAccessCheck(requestUserId: string, vaultId: string, vaultUpdate: UpdateVaultRequestSchema): Promise<VaultDto> {
    await this.checkAccess(requestUserId, vaultId);
    return this.update(vaultId, vaultUpdate);
  }

  async delete(vaultId: string): Promise<void> {
    return this.vaultsDatabaseService.delete(vaultId);
  }

  async deleteWithAccessCheck(requestUserId: string, vaultId: string): Promise<void> {
    await this.checkAccess(requestUserId, vaultId);
    return this.delete(vaultId);
  }
}
