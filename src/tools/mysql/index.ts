import { Tool } from "../types";

export const mysqlToolDefinitions: Tool[] = [
  {
    name: "mysql_execute_query",
    description: "Execute SQL query on MySQL database",
    inputSchema: {
      type: "object",
      properties: {
        query: {
          type: "string",
          description: "SQL query to execute",
        },
      },
      required: ["query"],
    },
  },
  {
    name: "mysql_show_tables",
    description: "Show all tables in the current MySQL database",
    inputSchema: { type: "object", properties: {} },
  },
  {
    name: "mysql_describe_table",
    description: "Describe the structure of a MySQL table",
    inputSchema: {
      type: "object",
      properties: {
        table_name: {
          type: "string",
          description: "Name of the table to describe",
        },
      },
      required: ["table_name"],
    },
  },
  {
    name: "mysql_use_database",
    description: "Switch to a different MySQL database",
    inputSchema: {
      type: "object",
      properties: {
        database_name: {
          type: "string",
          description: "Name of the database to switch to",
        },
      },
      required: ["database_name"],
    },
  },
  {
    name: "mysql_list_databases",
    description: "List all databases the current user can see in MySQL",
    inputSchema: { type: "object", properties: {} },
  },
  {
    name: "mysql_get_schema",
    description: "Get the CREATE TABLE statement for a specific MySQL table",
    inputSchema: {
      type: "object",
      properties: {
        table_name: {
          type: "string",
          description: "The name of the table to get the schema for",
        },
      },
      required: ["table_name"],
    },
  },
];
