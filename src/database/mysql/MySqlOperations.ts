import { createConnection, Connection } from "mysql2/promise";
import { Database } from "../Database";
import { RdbOperations } from "./RdbOperations";

export class MySqlOperations implements Database, RdbOperations {
  private connection: Connection | null = null;

  async connect(): Promise<void> {
    const dbConfig = {
      host: process.env.DB_HOST || "localhost",
      port: parseInt(process.env.DB_PORT || "3306"),
      user: process.env.DB_USER || "root",
      password: process.env.DB_PASSWORD || "",
      database: process.env.DB_DATABASE,
    };
    try {
      this.connection = await createConnection(dbConfig);
      await this.connection.ping();
      console.error("MySQL connection established successfully");
    } catch (error: any) {
      console.error("Failed to connect to MySQL:", error.message);
      throw error;
    }
  }

  async disconnect(): Promise<void> {
    if (this.connection) {
      await this.connection.end();
      console.error("Disconnected from MySQL.");
    }
  }

  getOperations(): RdbOperations {
    return this;
  }

  async executeQuery(query: string): Promise<any> {
    if (!this.connection) throw new Error("Not connected to database");
    const [rows] = await this.connection.execute(query);
    return rows;
  }

  async showTables(): Promise<any> {
    if (!this.connection) throw new Error("Not connected to database");
    const [rows] = await this.connection.execute("SHOW TABLES");
    return rows;
  }

  async describeTable(tableName: string): Promise<any> {
    if (!this.connection) throw new Error("Not connected to database");
    const [rows] = await this.connection.execute("DESCRIBE `" + tableName + "`");
    return rows;
  }

  async useDatabase(databaseName: string): Promise<any> {
    if (!this.connection) throw new Error("Not connected to database");
    await this.connection.query("USE `" + databaseName + "`");
    return `Successfully switched to database: ${databaseName}`;
  }

  async listDatabases(): Promise<any> {
    if (!this.connection) throw new Error("Not connected to database");
    const [rows] = await this.connection.execute("SHOW DATABASES");
    return rows;
  }

  async getSchema(tableName: string): Promise<any> {
    if (!this.connection) throw new Error("Not connected to database");
    const [rows] = await this.connection.execute(
      "SHOW CREATE TABLE `" + tableName + "`"
    );
    return rows;
  }
}
