export interface RdbOperations {
  executeQuery(query: string): Promise<any>;
  showTables(): Promise<any>;
  describeTable(tableName: string): Promise<any>;
  useDatabase(databaseName: string): Promise<any>;
  listDatabases(): Promise<any>;
  getSchema(tableName: string): Promise<any>;
}
