// SDK에서 스키마 관련 타입을 명시적으로 export하지 않으므로, 범용 타입을 사용합니다.
export interface Tool {
  name: string;
  description: string;
  inputSchema: Record<string, any>;
}

export const toolDefinitions: Tool[] = [
  {
    name: "execute_query",
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
    name: "show_tables",
    description: "Show all tables in the database",
    inputSchema: { type: "object", properties: {} },
  },
  {
    name: "describe_table",
    description: "Describe the structure of a table",
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
    name: "use_database",
    description: "Switch to a different database",
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
    name: "list_databases",
    description: "List all databases the current user can see",
    inputSchema: { type: "object", properties: {} },
  },
  {
    name: "get_schema",
    description: "Get the CREATE TABLE statement for a specific table",
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
