# DB Gateway MCP Server

## Project Description

The **DB Gateway MCP Server** is a versatile backend service designed to provide a unified interface for interacting with various database systems. It abstracts database-specific operations and exposes them as callable tools via the Model Context Protocol (MCP). This allows for flexible integration with AI agents or other services that can leverage these database capabilities.

## Features

*   **Multi-Database Support**: Connects to MySQL, MongoDB, and Redis.
*   **Dynamic Connection**: Configures database connections dynamically based on environment variables.
*   **Unified Tooling**: Exposes database operations (CRUD, schema management, etc.) as standardized MCP tools.
*   **Extensible Architecture**: Designed with a clear separation of concerns, making it easy to add support for new database types or extend existing functionalities.

## Getting Started

### Prerequisites

*   Node.js (v18 or higher recommended)
*   npm (Node Package Manager)
*   Docker (for running database instances, optional but recommended)

### Installation

1.  Clone the repository:
    ```bash
    git clone <repository_url>
    cd db-gateway
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Set up your databases (using Docker Compose is recommended):
    ```bash
    # Example: Start MySQL, MongoDB, Redis containers
    docker-compose up -d
    ```
    The sample Docker Compose files used by the project live in the [`sijunkim/resources`](https://github.com/sijunkim/resources) repository. Each database has its own compose file, so you can launch only the services you need (for example, `docker-compose -f mysql/docker-compose.yml up -d`). If you already maintain local database instances—or cannot run Docker—point the `.env` connection settings to those instances instead of cloning the resources repository.

## Environment Variables

The server's behavior is configured via environment variables. Create a `.env` file in the project root and populate it with the following:

```env
# Comma-separated list of databases to connect to (e.g., "mysql,mongodb,redis")
DBS=mysql,mongodb,redis

# MySQL Connection Details
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=1234
DB_DATABASE=naver_news

# MongoDB Connection Details
# Example URI with authentication. Adjust host if running db-gateway in Docker.
MONGODB_URI=mongodb://admin:password@localhost:27017/test

# Redis Connection Details
# Adjust host if running db-gateway in Docker.
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=sijunkim
```

*   **Note on Dockerized Environments**: If the `db-gateway` server itself is running inside a Docker container on the same network as your databases (e.g., `local-network` as defined in `docker-compose.yml`), you should use the Docker service names as hosts (e.g., `DB_HOST=mysql`, `REDIS_HOST=redis`, `MONGODB_URI=mongodb://admin:password@mongodb:27017/test`).

## Running the Server

To start the DB Gateway MCP Server:

```bash
npm start
```

## MCP Server Connection Example

This server can be integrated with an MCP client (e.g., a Gemini agent) by configuring it as an external MCP server. Below is an example configuration snippet, demonstrating how to use environment variables for sensitive information:

```json
{
  "theme": "Atom One",
  "selectedAuthType": "oauth-personal",
  "mcpServers": {
    "dbGateway": {
      "command": "npx",
      "args": [
        "-y",
        "ts-node",
        "/Users/kimsijun/Source/db-gateway/src/index.ts"
      ],
      "env": {
        "DBS": "mysql,redis",
        "DB_HOST": "${DB_HOST}",
        "DB_PORT": "${DB_PORT}",
        "DB_USER": "${DB_USER}",
        "DB_PASSWORD": "${DB_PASSWORD}",
        "DB_DATABASE": "${DB_DATABASE}",
        "REDIS_HOST": "${REDIS_HOST}",
        "REDIS_PORT": "${REDIS_PORT}",
        "REDIS_PASSWORD": "${REDIS_PASSWORD}",
        "MONGODB_URI": "${MONGODB_URI}"
      }
    }
  }
}
```
*   **Explanation**: In the `env` block, values like `"${DB_HOST}"` are placeholders that will be replaced by the actual environment variable values from your system or `.env` file when the MCP server is launched. This ensures sensitive credentials are not hardcoded directly into the configuration.
