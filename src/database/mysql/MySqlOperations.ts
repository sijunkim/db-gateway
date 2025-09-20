import { createConnection, Connection } from "mysql2/promise";
import { Database } from "../Database";
import { RdbOperations } from "./RdbOperations";

const KEEP_ALIVE_INTERVAL_MS = 15 * 60 * 1000; // 15 minutes
const ONE_HOUR_SECONDS = 60 * 60;

export class MySqlOperations implements Database, RdbOperations {
  private connection: Connection | null = null;
  private keepAliveTimer: NodeJS.Timeout | null = null;

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
      await this.configureSessionTimeouts();
      this.startKeepAlive();
      console.error("MySQL connection established successfully");
    } catch (error: any) {
      console.error("Failed to connect to MySQL:", error.message);
      throw error;
    }
  }

  async disconnect(): Promise<void> {
    this.stopKeepAlive();
    if (this.connection) {
      await this.connection.end();
      this.connection = null;
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

  private async configureSessionTimeouts(): Promise<void> {
    if (!this.connection) return;
    try {
      await this.connection.query(
        `SET SESSION wait_timeout = ${ONE_HOUR_SECONDS}`
      );
      await this.connection.query(
        `SET SESSION interactive_timeout = ${ONE_HOUR_SECONDS}`
      );
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      console.error("Failed to set MySQL session timeout:", message);
    }
  }

  private startKeepAlive(): void {
    if (this.keepAliveTimer || !this.connection) return;
    this.keepAliveTimer = setInterval(async () => {
      try {
        await this.connection?.ping();
      } catch (error: unknown) {
        const message = error instanceof Error ? error.message : String(error);
        console.error("MySQL keep-alive ping failed:", message);
      }
    }, KEEP_ALIVE_INTERVAL_MS);
    this.keepAliveTimer.unref?.();
  }

  private stopKeepAlive(): void {
    if (!this.keepAliveTimer) return;
    clearInterval(this.keepAliveTimer);
    this.keepAliveTimer = null;
  }
}
