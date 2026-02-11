import 'reflect-metadata';
import path from 'path';
import { defineConfig } from '@mikro-orm/sqlite';
import { RequestHistory } from '../entities/RequestHistory';

export default defineConfig({
  entities: [RequestHistory],
  dbName: path.join(process.cwd(), 'database.sqlite'),
  debug: process.env.NODE_ENV === 'development',
});
