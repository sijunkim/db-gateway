// 이 인터페이스는 MCP 서버가 노출하는 도구들의 실제 동작을 정의합니다.
export interface DatabaseOperations {
  connect(): Promise<void>;
  disconnect(): Promise<void>;
  executeQuery(query: string): Promise<any>;
  showTables(): Promise<any>;
  describeTable(tableName: string): Promise<any>;
  useDatabase(databaseName: string): Promise<any>;
  listDatabases(): Promise<any>;
  getSchema(tableName: string): Promise<any>;
}
