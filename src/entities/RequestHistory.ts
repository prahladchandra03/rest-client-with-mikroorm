import { Entity, PrimaryKey, Property } from '@mikro-orm/core';

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

  @Property()
  createdAt: Date = new Date();
}
