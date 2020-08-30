import * as knex from 'knex';

export interface UserRecord {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    permittedObjects?: string;
    hash: string;
}

// eslint-disable-next-line import/prefer-default-export
export default class UserRepository {
    private db: knex;

    constructor(db: knex) {
        this.db = db;
    }

    async getUserWithEmail(email: string): Promise<UserRecord | null> {
        const [user] = await this.db('user').where({ 'user.email': email }).select({
            id: 'user.id',
            firstName: 'user.first_name',
            lastName: 'user.last_name',
            email: 'user.email',
            hash: 'user.hash',
        });

        return user;
    }

    async getPermittedObjectsForUser(id: number): Promise<string | null> {
        const objects = await this.db('permission')
            .where({ 'permission.user_id': id })
            .distinct('object')
            .select({
                object: 'permission.object',
            });
        const permittedObjects = objects.map((o: any) => o.object).join(',');
        return permittedObjects;
    }
}
