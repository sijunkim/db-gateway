import { Tool } from "../types";

export const redisToolDefinitions: Tool[] = [
  // String Operations
  {
    name: "redis_get",
    description: "Get the value of a string key in Redis",
    inputSchema: {
      type: "object",
      properties: { key: { type: "string", description: "The key to retrieve" } },
      required: ["key"],
    },
  },
  {
    name: "redis_set",
    description: "Set the string value of a key in Redis",
    inputSchema: {
      type: "object",
      properties: {
        key: { type: "string", description: "The key to set" },
        value: { type: "string", description: "The value to set" },
        options: { type: "object", description: "Optional SET options (e.g., EX, PX, NX, XX)" },
      },
      required: ["key", "value"],
    },
  },
  {
    name: "redis_del",
    description: "Delete one or more keys from Redis",
    inputSchema: {
      type: "object",
      properties: { keys: { type: "array", items: { type: "string" }, description: "Keys to delete" } },
      required: ["keys"],
    },
  },
  {
    name: "redis_incr",
    description: "Increment the integer value of a key by one in Redis",
    inputSchema: {
      type: "object",
      properties: { key: { type: "string", description: "The key to increment" } },
      required: ["key"],
    },
  },
  {
    name: "redis_decr",
    description: "Decrement the integer value of a key by one in Redis",
    inputSchema: {
      type: "object",
      properties: { key: { type: "string", description: "The key to decrement" } },
      required: ["key"],
    },
  },

  // Hash Operations
  {
    name: "redis_hget",
    description: "Get the value of a hash field in Redis",
    inputSchema: {
      type: "object",
      properties: {
        key: { type: "string", description: "The hash key" },
        field: { type: "string", description: "The field to retrieve" },
      },
      required: ["key", "field"],
    },
  },
  {
    name: "redis_hset",
    description: "Set the string value of a hash field in Redis",
    inputSchema: {
      type: "object",
      properties: {
        key: { type: "string", description: "The hash key" },
        field: { type: "string", description: "The field to set" },
        value: { type: "string", description: "The value to set" },
      },
      required: ["key", "field", "value"],
    },
  },
  {
    name: "redis_hgetall",
    description: "Get all fields and values of a hash in Redis",
    inputSchema: {
      type: "object",
      properties: { key: { type: "string", description: "The hash key" } },
      required: ["key"],
    },
  },
  {
    name: "redis_hdel",
    description: "Delete one or more hash fields from Redis",
    inputSchema: {
      type: "object",
      properties: {
        key: { type: "string", description: "The hash key" },
        fields: { type: "array", items: { type: "string" }, description: "Fields to delete" },
      },
      required: ["key", "fields"],
    },
  },

  // List Operations
  {
    name: "redis_lpush",
    description: "Prepend one or multiple values to a list in Redis",
    inputSchema: {
      type: "object",
      properties: {
        key: { type: "string", description: "The list key" },
        elements: { type: "array", items: { type: "string" }, description: "Elements to prepend" },
      },
      required: ["key", "elements"],
    },
  },
  {
    name: "redis_rpush",
    description: "Append one or multiple values to a list in Redis",
    inputSchema: {
      type: "object",
      properties: {
        key: { type: "string", description: "The list key" },
        elements: { type: "array", items: { type: "string" }, description: "Elements to append" },
      },
      required: ["key", "elements"],
    },
  },
  {
    name: "redis_lpop",
    description: "Remove and get the first element in a list in Redis",
    inputSchema: {
      type: "object",
      properties: { key: { type: "string", description: "The list key" } },
      required: ["key"],
    },
  },
  {
    name: "redis_rpop",
    description: "Remove and get the last element in a list in Redis",
    inputSchema: {
      type: "object",
      properties: { key: { type: "string", description: "The list key" } },
      required: ["key"],
    },
  },
  {
    name: "redis_lrange",
    description: "Get a range of elements from a list in Redis",
    inputSchema: {
      type: "object",
      properties: {
        key: { type: "string", description: "The list key" },
        start: { type: "number", description: "Start index" },
        stop: { type: "number", description: "Stop index" },
      },
      required: ["key", "start", "stop"],
    },
  },

  // Set Operations
  {
    name: "redis_sadd",
    description: "Add one or more members to a set in Redis",
    inputSchema: {
      type: "object",
      properties: {
        key: { type: "string", description: "The set key" },
        members: { type: "array", items: { type: "string" }, description: "Members to add" },
      },
      required: ["key", "members"],
    },
  },
  {
    name: "redis_srem",
    description: "Remove one or more members from a set in Redis",
    inputSchema: {
      type: "object",
      properties: {
        key: { type: "string", description: "The set key" },
        members: { type: "array", items: { type: "string" }, description: "Members to remove" },
      },
      required: ["key", "members"],
    },
  },
  {
    name: "redis_smembers",
    description: "Get all members of a set in Redis",
    inputSchema: {
      type: "object",
      properties: { key: { type: "string", description: "The set key" } },
      required: ["key"],
    },
  },
  {
    name: "redis_sismember",
    description: "Check if a member is a member of a set in Redis",
    inputSchema: {
      type: "object",
      properties: {
        key: { type: "string", description: "The set key" },
        member: { type: "string", description: "The member to check" },
      },
      required: ["key", "member"],
    },
  },

  // Sorted Set Operations
  {
    name: "redis_zadd",
    description: "Add one or more members to a sorted set in Redis",
    inputSchema: {
      type: "object",
      properties: {
        key: { type: "string", description: "The sorted set key" },
        members: { type: "array", items: { type: "object", properties: { score: { type: "number" }, value: { type: "string" } }, required: ["score", "value"] }, description: "Members to add with their scores" },
      },
      required: ["key", "members"],
    },
  },
  {
    name: "redis_zrange",
    description: "Get a range of members from a sorted set in Redis",
    inputSchema: {
      type: "object",
      properties: {
        key: { type: "string", description: "The sorted set key" },
        min: { type: "number", description: "Start index or score" },
        max: { type: "number", description: "Stop index or score" },
        options: { type: "object", description: "Optional ZRANGE options (e.g., BY, REV, WITHSCORES, LIMIT)" },
      },
      required: ["key", "min", "max"],
    },
  },
  {
    name: "redis_zrem",
    description: "Remove one or more members from a sorted set in Redis",
    inputSchema: {
      type: "object",
      properties: {
        key: { type: "string", description: "The sorted set key" },
        members: { type: "array", items: { type: "string" }, description: "Members to remove" },
      },
      required: ["key", "members"],
    },
  },

  // General Operations
  {
    name: "redis_keys",
    description: "Find all keys matching the given pattern in Redis",
    inputSchema: {
      type: "object",
      properties: { pattern: { type: "string", description: "The key pattern" } },
      required: ["pattern"],
    },
  },
  {
    name: "redis_expire",
    description: "Set a key's time to live in seconds in Redis",
    inputSchema: {
      type: "object",
      properties: {
        key: { type: "string", description: "The key to set TTL for" },
        seconds: { type: "number", description: "Time to live in seconds" },
      },
      required: ["key", "seconds"],
    },
  },
  {
    name: "redis_ttl",
    description: "Get the time to live for a key in Redis",
    inputSchema: {
      type: "object",
      properties: { key: { type: "string", description: "The key to check TTL for" } },
      required: ["key"],
    },
  },
  {
    name: "redis_flushdb",
    description: "Delete all keys of the currently selected Redis database",
    inputSchema: { type: "object", properties: {} },
  },
  {
    name: "redis_flushall",
    description: "Delete all keys of all Redis databases",
    inputSchema: { type: "object", properties: {} },
  },
];
