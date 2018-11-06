import { inject, injectable } from 'inversify';

import { TYPE } from '../../constant';
import { Organization } from '../../model';
import { DBClient } from '../client';
import { BaseRepository } from './base.repository';
import { join } from 'path';

@injectable()
export class OrganizationRepository extends BaseRepository<Organization> {
  constructor(@inject(TYPE.DBClient) protected client: DBClient) {
    super(client, 'organization');

    client.events.on('dbConnected', () => {
      client.db.collection('organization').createIndex({ organizationId: 1 }, { unique: true });
      client.db.collection('organization').createIndex({ title: 1 }, { unique: true });
      client.db.collection('organization').createIndex({ owner: 1 }, { unique: true });
    });
  }

  get paginatedField(): string {
    return 'createdOn';
  }

  get paginatedAscending(): boolean {
    return false;
  }

  public async getNewOrganizationIdentifier(): Promise<number> {
    const result = await this.client.db
      .collection('identityCounter')
      .findOneAndUpdate(
        { indentity: 'organization_index' },
        { $inc: { count: 9 } },
        { upsert: true, returnOriginal: false }
      );

    return result.value.count;
  }
}
