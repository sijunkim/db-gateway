import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { MySqlOperations } from "./database/mysql/MySqlOperations";
import { DatabaseOperations } from "./database/Database";
import { toolDefinitions } from "./tools/index";
import { createToolHandlers } from "./handlers/toolHandlers";

async function main() {
  console.log("Starting DB Gateway MCP Server...");

  const dbOperations: DatabaseOperations = new MySqlOperations();

  try {
    await dbOperations.connect();
  } catch (error) {
    process.exit(1);
  }

  const server = new Server(
    { name: "db-gateway", version: "1.0.0" },
    { capabilities: { tools: {} } }
  );

  server.setRequestHandler(ListToolsRequestSchema, async () => {
    console.log("Tools list requested");
    return { tools: toolDefinitions };
  });

  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    console.log(`Tool call requested: ${request.params.name}`);

    const toolHandlers = createToolHandlers(dbOperations);
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
    await dbOperations.disconnect();
    process.exit(0);
  };
  process.on("SIGINT", cleanup);
  process.on("SIGTERM", cleanup);

  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.log("MySQL MCP Server is running and connected");
}

main().catch((error) => {
  const message = error instanceof Error ? error.message : String(error);
  console.error("Server startup error:", message);
  process.exit(1);
});
