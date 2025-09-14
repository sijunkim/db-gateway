import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { Database } from "./database/Database";
import { createDatabase } from "./database/databaseFactory";
import { toolDefinitions } from "./tools/index";
import { createToolHandlers } from "./handlers/toolHandlers";

async function main() {
  console.error("Starting DB Gateway MCP Server...");

  const connections: { [key: string]: Database } = {};
  const dbTypes = process.env.DBS?.split(",") || [];

  try {
    for (const dbType of dbTypes) {
      const db = createDatabase(dbType.trim());
      await db.connect();
      connections[dbType.trim()] = db;
    }
    if (Object.keys(connections).length === 0) {
      console.error(
        "No databases configured to connect. Please set the DBS environment variable."
      );
    } else {
      console.error(
        `Successfully connected to: ${Object.keys(connections).join(", ")}`
      );
    }
  } catch (error) {
    console.error("Failed to connect to one or more databases.", error);
    process.exit(1);
  }

  const server = new Server(
    { name: "db-gateway", version: "1.0.0" },
    { capabilities: { tools: {} } }
  );

  server.setRequestHandler(ListToolsRequestSchema, async () => {
    console.error(`Tools list requested`);
    return { tools: toolDefinitions };
  });

  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    console.error(`Tool call requested: ${request.params.name}`);

    const toolHandlers = createToolHandlers(connections);
    const handler = toolHandlers[request.params.name];
    if (!handler) {
      throw new Error(`Unknown tool: ${request.params.name}`);
    }

    try {
      const result = await handler(request.params.arguments);
      return {
        content: [
          {
            type: "text",
            text:
              typeof result === "string"
                ? result
                : JSON.stringify(result, null, 2),
          },
        ],
      };
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      console.error(`Error executing tool ${request.params.name}:`, message);
      return {
        content: [{ type: "text", text: `Error: ${message}` }],
        isError: true,
      };
    }
  });

  const cleanup = async () => {
    console.error("Shutting down gracefully...");
    for (const db of Object.values(connections)) {
      await db.disconnect();
    }
    process.exit(0);
  };
  process.on("SIGINT", cleanup);
  process.on("SIGTERM", cleanup);

  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("DB Gateway MCP Server is running and connected.");
}

main().catch((error) => {
  const message = error instanceof Error ? error.message : String(error);
  console.error("Server startup error:", message);
  process.exit(1);
});
