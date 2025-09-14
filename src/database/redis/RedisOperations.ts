import { createClient, RedisClientType } from "redis";
import { Database } from "../Database";
import { RedisSpecificOperations } from "./RedisSpecificOperations";

export class RedisOperations implements Database, RedisSpecificOperations {
  private client: RedisClientType | null = null;

  async connect(): Promise<void> {
    this.client = createClient({
      password: process.env.REDIS_PASSWORD,
      socket: {
        host: process.env.REDIS_HOST || "localhost",
        port: parseInt(process.env.REDIS_PORT || "6379"),
      },
    });
    this.client.on("error", (err) => console.error("Redis Client Error", err));
    await this.client.connect();
    console.error("Redis connection established successfully");
  }

  async disconnect(): Promise<void> {
    if (this.client) {
      await this.client.quit();
      console.error("Disconnected from Redis.");
    }
  }

  getOperations(): RedisSpecificOperations {
    return this;
  }

  // String Operations
  async get(key: string): Promise<string | null> {
    if (!this.client) throw new Error("Redis client not connected.");
    return this.client.get(key);
  }

  async set(
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
  ): Promise<string | null> {
    if (!this.client) throw new Error("Redis client not connected.");
    return this.client.set(key, value, options);
  }

  async del(keys: string | string[]): Promise<number> {
    if (!this.client) throw new Error("Redis client not connected.");
    return this.client.del(keys);
  }

  async incr(key: string): Promise<number> {
    if (!this.client) throw new Error("Redis client not connected.");
    return this.client.incr(key);
  }

  async decr(key: string): Promise<number> {
    if (!this.client) throw new Error("Redis client not connected.");
    return this.client.decr(key);
  }

  // Hash Operations
  async hGet(key: string, field: string): Promise<string | null> {
    if (!this.client) throw new Error("Redis client not connected.");
    return this.client.hGet(key, field);
  }

  async hSet(key: string, field: string, value: string): Promise<number> {
    if (!this.client) throw new Error("Redis client not connected.");
    return this.client.hSet(key, field, value);
  }

  async hGetAll(key: string): Promise<Record<string, string>> {
    if (!this.client) throw new Error("Redis client not connected.");
    return this.client.hGetAll(key);
  }

  async hDel(key: string, fields: string | string[]): Promise<number> {
    if (!this.client) throw new Error("Redis client not connected.");
    return this.client.hDel(key, fields);
  }

  // List Operations
  async lPush(key: string, elements: string | string[]): Promise<number> {
    if (!this.client) throw new Error("Redis client not connected.");
    return this.client.lPush(key, elements);
  }

  async rPush(key: string, elements: string | string[]): Promise<number> {
    if (!this.client) throw new Error("Redis client not connected.");
    return this.client.rPush(key, elements);
  }

  async lPop(key: string): Promise<string | null> {
    if (!this.client) throw new Error("Redis client not connected.");
    return this.client.lPop(key);
  }

  async rPop(key: string): Promise<string | null> {
    if (!this.client) throw new Error("Redis client not connected.");
    return this.client.rPop(key);
  }

  async lRange(key: string, start: number, stop: number): Promise<string[]> {
    if (!this.client) throw new Error("Redis client not connected.");
    return this.client.lRange(key, start, stop);
  }

  // Set Operations
  async sAdd(key: string, members: string | string[]): Promise<number> {
    if (!this.client) throw new Error("Redis client not connected.");
    return this.client.sAdd(key, members);
  }

  async sRem(key: string, members: string | string[]): Promise<number> {
    if (!this.client) throw new Error("Redis client not connected.");
    return this.client.sRem(key, members);
  }

  async sMembers(key: string): Promise<string[]> {
    if (!this.client) throw new Error("Redis client not connected.");
    return this.client.sMembers(key);
  }

  async sIsMember(key: string, member: string): Promise<number> {
    if (!this.client) throw new Error("Redis client not connected.");
    return this.client.sIsMember(key, member);
  }

  // Sorted Set Operations
  async zAdd(
    key: string,
    members: { score: number; value: string }[]
  ): Promise<number> {
    if (!this.client) throw new Error("Redis client not connected.");
    return this.client.zAdd(key, members);
  }

  async zRange(
    key: string,
    min: number | string,
    max: number | string,
    options?: {
      BY?: "SCORE" | "LEX";
      REV?: boolean;
      WITHSCORES?: boolean;
      LIMIT?: { offset: number; count: number };
    }
  ): Promise<string[]> {
    if (!this.client) throw new Error("Redis client not connected.");
    return this.client.zRange(key, min, max, options);
  }

  async zRem(key: string, members: string | string[]): Promise<number> {
    if (!this.client) throw new Error("Redis client not connected.");
    return this.client.zRem(key, members);
  }

  // General Operations
  async keys(pattern: string): Promise<string[]> {
    if (!this.client) throw new Error("Redis client not connected.");
    return this.client.keys(pattern);
  }

  async expire(key: string, seconds: number): Promise<number> {
    if (!this.client) throw new Error("Redis client not connected.");
    return this.client.expire(key, seconds);
  }

  async ttl(key: string): Promise<number> {
    if (!this.client) throw new Error("Redis client not connected.");
    return this.client.ttl(key);
  }

  async flushDb(): Promise<string> {
    if (!this.client) throw new Error("Redis client not connected.");
    return this.client.flushDb();
  }

  async flushAll(): Promise<string> {
    if (!this.client) throw new Error("Redis client not connected.");
    return this.client.flushAll();
  }
}
