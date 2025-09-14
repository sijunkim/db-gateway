import { RdbOperations } from "./mysql/RdbOperations";
import { MongoDbSpecificOperations } from "./mongodb/MongoDbSpecificOperations";
import { RedisSpecificOperations } from "./redis/RedisSpecificOperations";

export interface Database {
  connect(): Promise<void>;
  disconnect(): Promise<void>;
  getOperations(): RdbOperations | MongoDbSpecificOperations | RedisSpecificOperations;
}
