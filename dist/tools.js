"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toolDefinitions = void 0;
exports.toolDefinitions = [
    {
        name: "execute_query",
        description: "Execute SQL query on MySQL database",
        inputSchema: {
            type: "object",
            properties: {
                query: {
                    type: "string",
                    description: "SQL query to execute"
                }
            },
            required: ["query"]
        }
    },
    {
        name: "show_tables",
        description: "Show all tables in the database",
        inputSchema: { type: "object", properties: {} }
    },
    {
        name: "describe_table",
        description: "Describe the structure of a table",
        inputSchema: {
            type: "object",
            properties: {
                table_name: {
                    type: "string",
                    description: "Name of the table to describe"
                }
            },
            required: ["table_name"]
        }
    },
    {
        name: "use_database",
        description: "Switch to a different database",
        inputSchema: {
            type: "object",
            properties: {
                database_name: {
                    type: "string",
                    description: "Name of the database to switch to"
                }
            },
            required: ["database_name"]
        }
    }
];
