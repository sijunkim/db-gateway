import { DatabaseOperations } from "../database/Database";
import { hasStringProperty } from "../utils/typeGuards";

export function createToolHandlers(dbOperations: DatabaseOperations): {
  [key: string]: (args: unknown) => Promise<any>;
} {
  return {
    execute_query: (args) => {
      if (!hasStringProperty(args, "query"))
        throw new Error("Argument 'query' must be a string.");
      return dbOperations.executeQuery(args.query);
    },
    show_tables: () => dbOperations.showTables(),
    describe_table: (args) => {
      if (!hasStringProperty(args, "table_name"))
        throw new Error("Argument 'table_name' must be a string.");
      return dbOperations.describeTable(args.table_name);
    },
    use_database: (args) => {
      if (!hasStringProperty(args, "database_name"))
        throw new Error("Argument 'database_name' must be a string.");
      return dbOperations.useDatabase(args.database_name);
    },
    list_databases: () => dbOperations.listDatabases(),
    get_schema: (args) => {
      if (!hasStringProperty(args, "table_name"))
        throw new Error("Argument 'table_name' must be a string.");
      return dbOperations.getSchema(args.table_name);
    },
  };
}
