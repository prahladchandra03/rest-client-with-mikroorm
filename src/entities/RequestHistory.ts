import { Entity, PrimaryKey, Property, Opt } from '@mikro-orm/core';

@Entity()
export class RequestHistory {
  @PrimaryKey()
  id!: number;

  @Property()
  method!: string;

  @Property()
  url!: string;

  @Property({ type: 'json', nullable: true })
  headers?: object;

  @Property({ type: 'json', nullable: true })
  body?: object;

  @Property()
  status!: number;

  @Property({ type: 'json', nullable: true })
  response?: object;

  // 2. Change 'Date' to 'Date & Opt'
  @Property()
  createdAt: Date & Opt = new Date(); 
}