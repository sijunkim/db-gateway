import { Database } from "../database/Database";
import { RdbOperations } from "../database/mysql/RdbOperations";
import { MongoDbSpecificOperations } from "../database/mongodb/MongoDbSpecificOperations";
import { RedisSpecificOperations } from "../database/redis/RedisSpecificOperations";
import { hasStringProperty } from "../utils/typeGuards";

// Generic type guard for checking if an object has a property
function hasProperty<T, K extends PropertyKey>(obj: T, key: K): obj is T & Record<K, unknown> {
  return typeof obj === 'object' && obj !== null && key in obj;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ToolHandler = (args: any) => Promise<any>;

export function createToolHandlers(connections: {
  [key: string]: Database;
}): { [key: string]: ToolHandler } {
  const handlers: { [key: string]: ToolHandler } = {};

  for (const [dbType, db] of Object.entries(connections)) {
    if (dbType === "mysql") {
      const rdbOps = db.getOperations() as RdbOperations;
      handlers["mysql_execute_query"] = (args) => {
        if (!hasStringProperty(args, "query"))
          throw new Error("Argument 'query' must be a string.");
        return rdbOps.executeQuery(args.query);
      };
      handlers["mysql_show_tables"] = () => rdbOps.showTables();
      handlers["mysql_describe_table"] = (args) => {
        if (!hasStringProperty(args, "table_name"))
          throw new Error("Argument 'table_name' must be a string.");
        return rdbOps.describeTable(args.table_name);
      };
      handlers["mysql_use_database"] = (args) => {
        if (!hasStringProperty(args, "database_name"))
          throw new Error("Argument 'database_name' must be a string.");
        return rdbOps.useDatabase(args.database_name);
      };
      handlers["mysql_list_databases"] = () => rdbOps.listDatabases();
      handlers["mysql_get_schema"] = (args) => {
        if (!hasStringProperty(args, "table_name"))
          throw new Error("Argument 'table_name' must be a string.");
        return rdbOps.getSchema(args.table_name);
      };
    }
    if (dbType === "mongodb") {
      const mongoOps = db.getOperations() as MongoDbSpecificOperations;

      handlers["mongodb_list_databases"] = () => mongoOps.listDatabases();
      handlers["mongodb_list_collections"] = (args) => {
        if (!hasStringProperty(args, "dbName")) throw new Error("Argument 'dbName' must be a string.");
        return mongoOps.listCollections(args.dbName);
      };
      handlers["mongodb_drop_collection"] = (args) => {
        if (!hasStringProperty(args, "dbName")) throw new Error("Argument 'dbName' must be a string.");
        if (!hasStringProperty(args, "collectionName")) throw new Error("Argument 'collectionName' must be a string.");
        return mongoOps.dropCollection(args.dbName, args.collectionName);
      };
      handlers["mongodb_create_index"] = (args) => {
        if (!hasStringProperty(args, "dbName")) throw new Error("Argument 'dbName' must be a string.");
        if (!hasStringProperty(args, "collectionName")) throw new Error("Argument 'collectionName' must be a string.");
        if (!hasProperty(args, "fieldSpec")) throw new Error("Argument 'fieldSpec' is required.");
        return mongoOps.createIndex(args.dbName, args.collectionName, args.fieldSpec as any, hasProperty(args, "options") ? args.options as any : undefined);
      };
      handlers["mongodb_find_one"] = (args) => {
        if (!hasStringProperty(args, "dbName")) throw new Error("Argument 'dbName' must be a string.");
        if (!hasStringProperty(args, "collectionName")) throw new Error("Argument 'collectionName' must be a string.");
        if (!hasProperty(args, "filter")) throw new Error("Argument 'filter' is required.");
        return mongoOps.findOne(args.dbName, args.collectionName, args.filter as any, hasProperty(args, "options") ? args.options as any : undefined);
      };
      handlers["mongodb_find_many"] = (args) => {
        if (!hasStringProperty(args, "dbName")) throw new Error("Argument 'dbName' must be a string.");
        if (!hasStringProperty(args, "collectionName")) throw new Error("Argument 'collectionName' must be a string.");
        if (!hasProperty(args, "filter")) throw new Error("Argument 'filter' is required.");
        return mongoOps.findMany(args.dbName, args.collectionName, args.filter as any, hasProperty(args, "options") ? args.options as any : undefined);
      };
      handlers["mongodb_insert_one"] = (args) => {
        if (!hasStringProperty(args, "dbName")) throw new Error("Argument 'dbName' must be a string.");
        if (!hasStringProperty(args, "collectionName")) throw new Error("Argument 'collectionName' must be a string.");
        if (!hasProperty(args, "doc")) throw new Error("Argument 'doc' is required.");
        return mongoOps.insertOne(args.dbName, args.collectionName, args.doc as any);
      };
      handlers["mongodb_insert_many"] = (args) => {
        if (!hasStringProperty(args, "dbName")) throw new Error("Argument 'dbName' must be a string.");
        if (!hasStringProperty(args, "collectionName")) throw new Error("Argument 'collectionName' must be a string.");
        if (!hasProperty(args, "docs")) throw new Error("Argument 'docs' is required.");
        return mongoOps.insertMany(args.dbName, args.collectionName, args.docs as any);
      };
      handlers["mongodb_update_one"] = (args) => {
        if (!hasStringProperty(args, "dbName")) throw new Error("Argument 'dbName' must be a string.");
        if (!hasStringProperty(args, "collectionName")) throw new Error("Argument 'collectionName' must be a string.");
        if (!hasProperty(args, "filter")) throw new Error("Argument 'filter' is required.");
        if (!hasProperty(args, "update")) throw new Error("Argument 'update' is required.");
        return mongoOps.updateOne(args.dbName, args.collectionName, args.filter as any, args.update as any);
      };
      handlers["mongodb_update_many"] = (args) => {
        if (!hasStringProperty(args, "dbName")) throw new Error("Argument 'dbName' must be a string.");
        if (!hasStringProperty(args, "collectionName")) throw new Error("Argument 'collectionName' must be a string.");
        if (!hasProperty(args, "filter")) throw new Error("Argument 'filter' is required.");
        if (!hasProperty(args, "update")) throw new Error("Argument 'update' is required.");
        return mongoOps.updateMany(args.dbName, args.collectionName, args.filter as any, args.update as any);
      };
      handlers["mongodb_delete_one"] = (args) => {
        if (!hasStringProperty(args, "dbName")) throw new Error("Argument 'dbName' must be a string.");
        if (!hasStringProperty(args, "collectionName")) throw new Error("Argument 'collectionName' must be a string.");
        if (!hasProperty(args, "filter")) throw new Error("Argument 'filter' is required.");
        return mongoOps.deleteOne(args.dbName, args.collectionName, args.filter as any);
      };
      handlers["mongodb_delete_many"] = (args) => {
        if (!hasStringProperty(args, "dbName")) throw new Error("Argument 'dbName' must be a string.");
        if (!hasStringProperty(args, "collectionName")) throw new Error("Argument 'collectionName' must be a string.");
        if (!hasProperty(args, "filter")) throw new Error("Argument 'filter' is required.");
        return mongoOps.deleteMany(args.dbName, args.collectionName, args.filter as any);
      };
      handlers["mongodb_aggregate"] = (args) => {
        if (!hasStringProperty(args, "dbName")) throw new Error("Argument 'dbName' must be a string.");
        if (!hasStringProperty(args, "collectionName")) throw new Error("Argument 'collectionName' must be a string.");
        if (!hasProperty(args, "pipeline")) throw new Error("Argument 'pipeline' is required.");
        return mongoOps.aggregate(args.dbName, args.collectionName, args.pipeline as any, hasProperty(args, "options") ? args.options as any : undefined);
      };
    }
    if (dbType === "redis") {
      const redisOps = db.getOperations() as RedisSpecificOperations;

      // String Operations
      handlers["redis_get"] = (args) => {
        if (!hasStringProperty(args, "key")) throw new Error("Argument 'key' must be a string.");
        return redisOps.get(args.key);
      };
      handlers["redis_set"] = (args) => {
        if (!hasStringProperty(args, "key")) throw new Error("Argument 'key' must be a string.");
        if (!hasStringProperty(args, "value")) throw new Error("Argument 'value' must be a string.");
        return redisOps.set(args.key, args.value, hasProperty(args, "options") ? args.options as any : undefined);
      };
      handlers["redis_del"] = (args) => {
        if (!hasProperty(args, "keys")) throw new Error("Argument 'keys' is required.");
        return redisOps.del(args.keys as any);
      };
      handlers["redis_incr"] = (args) => {
        if (!hasStringProperty(args, "key")) throw new Error("Argument 'key' must be a string.");
        return redisOps.incr(args.key);
      };
      handlers["redis_decr"] = (args) => {
        if (!hasStringProperty(args, "key")) throw new Error("Argument 'key' must be a string.");
        return redisOps.decr(args.key);
      };

      // Hash Operations
      handlers["redis_hget"] = (args) => {
        if (!hasStringProperty(args, "key")) throw new Error("Argument 'key' must be a string.");
        if (!hasStringProperty(args, "field")) throw new Error("Argument 'field' must be a string.");
        return redisOps.hGet(args.key, args.field);
      };
      handlers["redis_hset"] = (args) => {
        if (!hasStringProperty(args, "key")) throw new Error("Argument 'key' must be a string.");
        if (!hasStringProperty(args, "field")) throw new Error("Argument 'field' must be a string.");
        if (!hasStringProperty(args, "value")) throw new Error("Argument 'value' must be a string.");
        return redisOps.hSet(args.key, args.field, args.value);
      };
      handlers["redis_hgetall"] = (args) => {
        if (!hasStringProperty(args, "key")) throw new Error("Argument 'key' must be a string.");
        return redisOps.hGetAll(args.key);
      };
      handlers["redis_hdel"] = (args) => {
        if (!hasStringProperty(args, "key")) throw new Error("Argument 'key' must be a string.");
        if (!hasProperty(args, "fields")) throw new Error("Argument 'fields' is required.");
        return redisOps.hDel(args.key, args.fields as any);
      };

      // List Operations
      handlers["redis_lpush"] = (args) => {
        if (!hasStringProperty(args, "key")) throw new Error("Argument 'key' must be a string.");
        if (!hasProperty(args, "elements")) throw new Error("Argument 'elements' is required.");
        return redisOps.lPush(args.key, args.elements as any);
      };
      handlers["redis_rpush"] = (args) => {
        if (!hasStringProperty(args, "key")) throw new Error("Argument 'key' must be a string.");
        if (!hasProperty(args, "elements")) throw new Error("Argument 'elements' is required.");
        return redisOps.rPush(args.key, args.elements as any);
      };
      handlers["redis_lpop"] = (args) => {
        if (!hasStringProperty(args, "key")) throw new Error("Argument 'key' must be a string.");
        return redisOps.lPop(args.key);
      };
      handlers["redis_rpop"] = (args) => {
        if (!hasStringProperty(args, "key")) throw new Error("Argument 'key' must be a string.");
        return redisOps.rPop(args.key);
      };
      handlers["redis_lrange"] = (args) => {
        if (!hasStringProperty(args, "key")) throw new Error("Argument 'key' must be a string.");
        if (!hasProperty(args, "start") || typeof args.start !== 'number') throw new Error("Argument 'start' must be a number.");
        if (!hasProperty(args, "stop") || typeof args.stop !== 'number') throw new Error("Argument 'stop' must be a number.");
        return redisOps.lRange(args.key, args.start, args.stop);
      };

      // Set Operations
      handlers["redis_sadd"] = (args) => {
        if (!hasStringProperty(args, "key")) throw new Error("Argument 'key' must be a string.");
        if (!hasProperty(args, "members")) throw new Error("Argument 'members' is required.");
        return redisOps.sAdd(args.key, args.members as any);
      };
      handlers["redis_srem"] = (args) => {
        if (!hasStringProperty(args, "key")) throw new Error("Argument 'key' must be a string.");
        if (!hasProperty(args, "members")) throw new Error("Argument 'members' is required.");
        return redisOps.sRem(args.key, args.members as any);
      };
      handlers["redis_smembers"] = (args) => {
        if (!hasStringProperty(args, "key")) throw new Error("Argument 'key' must be a string.");
        return redisOps.sMembers(args.key);
      };
      handlers["redis_sismember"] = (args) => {
        if (!hasStringProperty(args, "key")) throw new Error("Argument 'key' must be a string.");
        if (!hasStringProperty(args, "member")) throw new Error("Argument 'member' must be a string.");
        return redisOps.sIsMember(args.key, args.member);
      };

      // Sorted Set Operations
      handlers["redis_zadd"] = (args) => {
        if (!hasStringProperty(args, "key")) throw new Error("Argument 'key' must be a string.");
        if (!hasProperty(args, "members")) throw new Error("Argument 'members' is required.");
        return redisOps.zAdd(args.key, args.members as any);
      };
      handlers["redis_zrange"] = (args) => {
        if (!hasStringProperty(args, "key")) throw new Error("Argument 'key' must be a string.");
        if (!hasProperty(args, "min")) throw new Error("Argument 'min' is required.");
        if (!hasProperty(args, "max")) throw new Error("Argument 'max' is required.");
        return redisOps.zRange(args.key, args.min as any, args.max as any, hasProperty(args, "options") ? args.options as any : undefined);
      };
      handlers["redis_zrem"] = (args) => {
        if (!hasStringProperty(args, "key")) throw new Error("Argument 'key' must be a string.");
        if (!hasProperty(args, "members")) throw new Error("Argument 'members' is required.");
        return redisOps.zRem(args.key, args.members as any);
      };

      // General Operations
      handlers["redis_keys"] = (args) => {
        if (!hasStringProperty(args, "pattern")) throw new Error("Argument 'pattern' must be a string.");
        return redisOps.keys(args.pattern);
      };
      handlers["redis_expire"] = (args) => {
        if (!hasStringProperty(args, "key")) throw new Error("Argument 'key' must be a string.");
        if (!hasProperty(args, "seconds") || typeof args.seconds !== 'number') throw new Error("Argument 'seconds' must be a number.");
        return redisOps.expire(args.key, args.seconds);
      };
      handlers["redis_ttl"] = (args) => {
        if (!hasStringProperty(args, "key")) throw new Error("Argument 'key' must be a string.");
        return redisOps.ttl(args.key);
      };
      handlers["redis_flushdb"] = () => redisOps.flushDb();
      handlers["redis_flushall"] = () => redisOps.flushAll();
    }
  }

  return handlers;
}