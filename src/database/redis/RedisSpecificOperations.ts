import { RedisClientType } from "redis";

export interface RedisSpecificOperations {
  get(key: string): Promise<string | null>;
  set(
    key: string,
    value: string,
    options?: {
      EX?: number;
      PX?: number;
      KEEPTTL?: boolean;
      GET?: boolean;
      XX?: boolean;
      NX?: boolean;
    }
  ): Promise<string | null>;
  del(keys: string | string[]): Promise<number>;
  incr(key: string): Promise<number>;
  decr(key: string): Promise<number>;

  hGet(key: string, field: string): Promise<string | null>;
  hSet(key: string, field: string, value: string): Promise<number>;
  hGetAll(key: string): Promise<Record<string, string>>; // Changed to Record<string, string>
  hDel(key: string, fields: string | string[]): Promise<number>;

  lPush(key: string, elements: string | string[]): Promise<number>;
  rPush(key: string, elements: string | string[]): Promise<number>;
  lPop(key: string): Promise<string | null>;
  rPop(key: string): Promise<string | null>;
  lRange(key: string, start: number, stop: number): Promise<string[]>;

  sAdd(key: string, members: string | string[]): Promise<number>;
  sRem(key: string, members: string | string[]): Promise<number>;
  sMembers(key: string): Promise<string[]>;
  sIsMember(key: string, member: string): Promise<number>;

  zAdd(
    key: string,
    members: { score: number; value: string }[]
  ): Promise<number>;
  zRange(
    key: string,
    min: number | string,
    max: number | string,
    options?: {
      BY?: "SCORE" | "LEX";
      REV?: boolean;
      WITHSCORES?: boolean;
      LIMIT?: { offset: number; count: number };
    }
  ): Promise<string[]>;
  zRem(key: string, members: string | string[]): Promise<number>;

  keys(pattern: string): Promise<string[]>;
  expire(key: string, seconds: number): Promise<number>;
  ttl(key: string): Promise<number>;
  flushDb(): Promise<string>;
  flushAll(): Promise<string>;
}
