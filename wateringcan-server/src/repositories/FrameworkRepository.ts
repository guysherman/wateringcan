import * as knex from 'knex';

import { RequestContext } from '../controllers/Types';

export interface Framework {
    id: number,
    name: string,
}

export default class FrameworkRepository {
    private db: knex;
    private ctx: RequestContext;

    constructor(db: knex, ctx: RequestContext) {
        this.db = db;
        this.ctx = ctx;
    }

    async createFramework(frameworkName: string): Promise<Framework> {
        const [{ numPerms }] = await this.db.from('permission')
            .where('permission.user_id', this.ctx.userId)
            .where('permission.object', 'framework')
            .where('permission.object_id', null)
            .where('permission.permission', 'create')
            .count('id', { as: 'numPerms' });

        if (parseInt(numPerms) === 1) {
            const id: number = await this.db.insert({
                name: frameworkName,
            })
                .returning('id')
                .into('framework');
    
            const f: Framework = {
                id,
                name: frameworkName,
            };
    
            return f;
        }
        return undefined;
    }

    async listFrameworks(): Promise<Framework[]> {
        const frameworks: Framework[] = await this.db('framework')
            .join('permission', (q) => {
                q.on((r) => {
                    r.on('permission.object_id', '=', 'framework.id');
                    r.orOnNull('permission.object_id');
                });
            })
            .where('permission.object', 'framework')
            .where('permission.permission', 'read')
            .where('permission.user_id', this.ctx.userId)
            .select('framework.*');

        return frameworks;
    }
}
