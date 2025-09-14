import { Tool } from "./types";
import { mysqlToolDefinitions } from "./mysql/index";
import { mongoToolDefinitions } from './mongodb/index';
import { redisToolDefinitions } from './redis/index';

const dbTools: { [key: string]: Tool[] } = {
  mysql: mysqlToolDefinitions,
  mongodb: mongoToolDefinitions,
  redis: redisToolDefinitions,
};

let toolDefinitions: Tool[] = [];
const dbTypes = process.env.DBS?.split(",") || [];

for (const dbType of dbTypes) {
  const tools = dbTools[dbType.trim()];
  if (tools) {
    toolDefinitions = toolDefinitions.concat(tools);
  }
}

export { toolDefinitions };
