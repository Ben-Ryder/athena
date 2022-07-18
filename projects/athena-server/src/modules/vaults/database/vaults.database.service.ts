import {Injectable, ResourceNotFoundError, ResourceRelationshipError, SystemError} from "@kangojs/core";
import {DatabaseService} from "../../../services/database/database.service";
import {PostgresError, Row, RowList, Sql} from "postgres";
import {PG_UNIQUE_VIOLATION} from "../../../services/database/database-error-codes";
import {AthenaErrorIdentifiers} from "../../../common/error-identifiers";
import {
  CreateVaultRequestSchema, MetaPaginationResponseSchema,
  UpdateVaultRequestSchema,
  VaultDto,
  VaultsQueryParamsSchema
} from "@ben-ryder/athena-js-lib";
import {InternalDatabaseVaultDto} from "../dto/internal-database-vault.dto-interface";
import {VaultWithOwnerDto} from "../dto/vault-with-owner.dto-interface";
import {DatabaseListOptions} from "../../../common/database-list-options";


@Injectable()
export class VaultsDatabaseService {
  constructor(
    private readonly databaseService: DatabaseService
  ) {}

  private static mapApplicationField(fieldName: string): string {
    switch (fieldName) {
      case 'created_at':
        return 'createdAt';
      case 'updated_at':
        return 'updatedAt';
      default:
        return fieldName;
    }
  }

  private static mapDatabaseEntity(vault: InternalDatabaseVaultDto): VaultDto {
    return {
      id: vault.id,
      name: vault.name,
      description: vault.description,
      createdAt: vault.created_at,
      updatedAt: vault.updated_at
    }
  }

  private static handleDatabaseError(e: any) {
    if (e instanceof PostgresError) {
      if (e.code && e.code === PG_UNIQUE_VIOLATION) {
        if (e.constraint_name === 'unique_user_vault_name') {
          throw new ResourceRelationshipError({
            identifier: AthenaErrorIdentifiers.VAULT_NAME_EXISTS,
            applicationMessage: "The supplied vault name already exists."
          })
        }
      }
    }

    throw new SystemError({
      message: "Unexpected error while creating vault",
      originalError: e
    })
  }

  async get(vaultId: string): Promise<VaultDto> {
    const sql = await this.databaseService.getSQL();

    let result: InternalDatabaseVaultDto[] = [];
    try {
      result = await sql<InternalDatabaseVaultDto[]>`SELECT * FROM vaults WHERE id = ${vaultId}`;
    }
    catch (e: any) {
      throw new SystemError({
        message: "Unexpected error while fetching vault",
        originalError: e
      })
    }

    if (result.length > 0) {
      return VaultsDatabaseService.mapDatabaseEntity(result[0]);
    }
    else {
      throw new ResourceNotFoundError({
        identifier: AthenaErrorIdentifiers.USER_NOT_FOUND,
        applicationMessage: "The requested vault could not be found."
      })
    }
  }

  async getWithUser(vaultId: string): Promise<VaultWithOwnerDto> {
    const sql = await this.databaseService.getSQL();

    let result: InternalDatabaseVaultDto[] = [];
    try {
      result = await sql<InternalDatabaseVaultDto[]>`SELECT * FROM vaults WHERE id = ${vaultId}`;
    }
    catch (e: any) {
      throw new SystemError({
        message: "Unexpected error while fetching vault",
        originalError: e
      })
    }

    if (result.length > 0) {
      return {
        ...VaultsDatabaseService.mapDatabaseEntity(result[0]),
        owner: result[0].owner
      }
    }
    else {
      throw new ResourceNotFoundError({
        identifier: AthenaErrorIdentifiers.USER_NOT_FOUND,
        applicationMessage: "The requested vault could not be found."
      })
    }
  }

  async create(ownerId: string, vault: CreateVaultRequestSchema): Promise<VaultDto> {
    const sql = await this.databaseService.getSQL();

    let result: InternalDatabaseVaultDto[] = [];
    try {
      result = await sql<InternalDatabaseVaultDto[]>`
        INSERT INTO vaults(id, name, description, created_at, updated_at, owner) 
        VALUES (DEFAULT, ${vault.name}, ${vault.description || null}, DEFAULT, DEFAULT, ${ownerId})
        RETURNING *;
       `;
    }
    catch (e: any) {
      VaultsDatabaseService.handleDatabaseError(e);
    }

    if (result.length > 0) {
      return VaultsDatabaseService.mapDatabaseEntity(result[0]);
    }
    else {
      throw new SystemError({
        message: "Unexpected error returning vault after creation",
      })
    }
  }

  async update(vaultId: string, vaultUpdate: UpdateVaultRequestSchema): Promise<VaultDto> {
    const sql = await this.databaseService.getSQL();

    // If there are no supplied fields to update, then just return the existing user.
    if (Object.keys(vaultUpdate).length === 0) {
      return this.get(vaultId);
    }

    // Process all fields
    // todo: this offers no protection against updating fields like id which should never be updated
    let updateObject: any = {};
    for (const fieldName of Object.keys(vaultUpdate) as Array<keyof UpdateVaultRequestSchema>) {
      updateObject[VaultsDatabaseService.mapApplicationField(fieldName)] = vaultUpdate[fieldName];
    }

    let result: InternalDatabaseVaultDto[] = [];
    try {
      result = await sql<InternalDatabaseVaultDto[]>`
        UPDATE vaults
        SET ${sql(updateObject, ...Object.keys(updateObject))}
        WHERE id = ${vaultId}
        RETURNING *;
      `;
    }
    catch (e: any) {
      VaultsDatabaseService.handleDatabaseError(e);
    }

    if (result.length > 0) {
      return VaultsDatabaseService.mapDatabaseEntity(result[0]);
    }
    else {
      throw new SystemError({
        message: "Unexpected error returning vault after creation",
      })
    }
  }

  async delete(vaultId: string): Promise<void> {
    const sql = await this.databaseService.getSQL();

    let result: RowList<Row[]>;
    try {
      result = await sql`DELETE FROM vaults WHERE id = ${vaultId}`;
    }
    catch (e: any) {
      throw new SystemError({
        message: "Unexpected error while deleting vault",
        originalError: e
      })
    }

    // If there's a count then rows were affected and the deletion was a success
    // If there's no count but an error wasn't thrown then the entity must not exist
    if (result && result.count) {
      return;
    }
    else {
      throw new ResourceNotFoundError({
        applicationMessage: "The requested vault could not be found."
      })
    }
  }

  async list(ownerId: string, options: DatabaseListOptions): Promise<VaultDto[]> {
    const sql = await this.databaseService.getSQL();

    // todo: this assumes that options.orderBy/options.orderDirection will always be validated etc
    let result: InternalDatabaseVaultDto[] = [];
    try {
      result = await sql<InternalDatabaseVaultDto[]>`SELECT * FROM vaults WHERE owner = ${ownerId} ORDER BY ${sql(options.orderBy)} ${options.orderDirection === "ASC" ? sql`ASC` : sql`DESC` } LIMIT ${options.take} OFFSET ${options.skip}`;
    }
    catch (e: any) {
      throw new SystemError({
        message: "Unexpected error while fetching vaults",
        originalError: e
      })
    }

    return result.map(VaultsDatabaseService.mapDatabaseEntity);
  }

  async getListMetadata(ownerId: string, options: DatabaseListOptions): Promise<MetaPaginationResponseSchema> {
    const sql = await this.databaseService.getSQL();

    // todo: this assumes that options.orderBy/options.orderDirection will always be validated etc
    try {
      // Offset and order don't matter for fetching the total count, so we can ignore these for the query.
      const result = await sql`SELECT count(*) FROM vaults WHERE owner = ${ownerId}`;
      return {
        total: parseInt(result[0].count),
        take: options.take,
        skip: options.skip,
      };
    }
    catch (e: any) {
      throw new SystemError({
        message: "Unexpected error while fetching vault list metadata",
        originalError: e
      })
    }
  }
}