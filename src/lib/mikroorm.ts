import 'reflect-metadata';
import { MikroORM } from '@mikro-orm/sqlite';
import config from './mikro.config';

const globalForORM = global as unknown as { orm: MikroORM };

export async function getORM() {
  if (!globalForORM.orm) {
    globalForORM.orm = await MikroORM.init(config);
  }
  return globalForORM.orm;
}
