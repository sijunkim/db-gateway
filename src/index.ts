import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { CallToolRequestSchema, ListToolsRequestSchema } from '@modelcontextprotocol/sdk/types.js';
import { MySqlOperations } from './database/mysql/MySqlOperations';
import { DatabaseOperations } from './database/Database';
import { toolDefinitions } from './tools';

// 4. 엄격한 타입 적용: 도구별 인자 타입을 명확히 정의
interface ExecuteQueryArgs { query: string; }
interface DescribeTableArgs { table_name: string; }
interface UseDatabaseArgs { database_name: string; }

// 4. 엄격한 타입 적용: 인자가 객체이고 특정 키를 가졌는지 확인하는 타입 가드
function hasStringProperty<T extends string>(obj: any, prop: T): obj is { [K in T]: string } {
  return obj && typeof obj === 'object' && typeof obj[prop] === 'string';
}

async function main() {
  console.error('Starting MySQL MCP Server...');

  const dbOperations: DatabaseOperations = new MySqlOperations();

  try {
    await dbOperations.connect();
  } catch (error) {
    process.exit(1);
  }

  const server = new Server(
    { name: "mysql-mcp-server", version: "1.0.0" },
    { capabilities: { tools: {} } }
  );

  // 3. 도구 목록 분리: 외부 파일에서 도구 정의를 가져와 사용
  server.setRequestHandler(ListToolsRequestSchema, async () => {
    console.error('Tools list requested');
    return { tools: toolDefinitions };
  });

  // 2. switch 문 제거: 핸들러 맵을 사용하여 확장성 개선
  const toolHandlers: { [key: string]: (args: unknown) => Promise<any> } = {
    "execute_query": (args) => {
      if (!hasStringProperty(args, 'query')) throw new Error('Argument \'query\' must be a string.');
      return dbOperations.executeQuery(args.query);
    },
    "show_tables": () => dbOperations.showTables(),
    "describe_table": (args) => {
      if (!hasStringProperty(args, 'table_name')) throw new Error('Argument \'table_name\' must be a string.');
      return dbOperations.describeTable(args.table_name);
    },
    "use_database": (args) => {
      if (!hasStringProperty(args, 'database_name')) throw new Error('Argument \'database_name\' must be a string.');
      return dbOperations.useDatabase(args.database_name);
    },
  };

  // 도구 호출 핸들러 (리팩토링됨)
  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    console.error(`Tool call requested: ${request.params.name}`);
    
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
            text: typeof result === 'string' ? result : JSON.stringify(result, null, 2)
          }
        ]
      };
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      console.error(`Error executing tool ${request.params.name}:`, message);
      return {
        content: [{ type: "text", text: `Error: ${message}` }],
        isError: true
      };
    }
  });

  const cleanup = async () => {
    console.error('Shutting down gracefully...');
    await dbOperations.disconnect();
    process.exit(0);
  };
  process.on('SIGINT', cleanup);
  process.on('SIGTERM', cleanup);

  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('MySQL MCP Server is running and connected');
}

main().catch((error) => {
  const message = error instanceof Error ? error.message : String(error);
  console.error('Server startup error:', message);
  process.exit(1);
});