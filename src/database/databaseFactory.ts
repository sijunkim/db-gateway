import { Database } from "./Database";
import { MySqlOperations } from "./mysql/MySqlOperations";
import { MongoDbOperations } from "./mongodb/MongoDbOperations";
import { RedisOperations } from "./redis/RedisOperations";

export enum DatabaseType {
  MySQL = "mysql",
  MongoDB = "mongodb",
  Redis = "redis",
}

export function createDatabase(dbType: string): Database {
  switch (dbType) {
    case DatabaseType.MySQL:
      return new MySqlOperations();
    case DatabaseType.MongoDB:
      return new MongoDbOperations();
    case DatabaseType.Redis:
      return new RedisOperations();
    default:
      throw new Error(`Unsupported database type: ${dbType}`);
  }
}
