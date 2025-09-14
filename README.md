# DB Gateway

## Description

This project is a gateway server that supports multiple databases. It currently supports MySQL, MongoDB, and Redis.

## Environment Variables

To run this project, you need to set the following environment variables. You can create a `.env` file in the root directory to manage them.

```
# A comma-separated list of databases to connect to. (e.g., "mysql,mongodb,redis")
DBS=mysql,mongodb,redis

# MySQL
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_DATABASE=

# MongoDB
# If running db-gateway in a Docker container on the same network, use 'mongodb' as host.
MONGODB_URI=mongodb://admin:password@localhost:27017/test

# Redis
# If running db-gateway in a Docker container on the same network, use 'redis' as host.
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=sijunkim
```
