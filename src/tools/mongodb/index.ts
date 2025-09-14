import { Tool } from "../types";

export const mongoToolDefinitions: Tool[] = [
  {
    name: "mongodb_list_databases",
    description: "List all databases in MongoDB",
    inputSchema: { type: "object", properties: {} },
  },
  {
    name: "mongodb_list_collections",
    description: "List all collections in a specified MongoDB database",
    inputSchema: {
      type: "object",
      properties: {
        dbName: { type: "string", description: "Name of the database" },
      },
      required: ["dbName"],
    },
  },
  {
    name: "mongodb_drop_collection",
    description: "Drop a collection from a specified MongoDB database",
    inputSchema: {
      type: "object",
      properties: {
        dbName: { type: "string", description: "Name of the database" },
        collectionName: { type: "string", description: "Name of the collection to drop" },
      },
      required: ["dbName", "collectionName"],
    },
  },
  {
    name: "mongodb_create_index",
    description: "Create an index on a specified MongoDB collection",
    inputSchema: {
      type: "object",
      properties: {
        dbName: { type: "string", description: "Name of the database" },
        collectionName: { type: "string", description: "Name of the collection" },
        fieldSpec: { type: "object", description: "Index field specification (e.g., { field: 1 } for ascending)" },
        options: { type: "object", description: "Optional index options" },
      },
      required: ["dbName", "collectionName", "fieldSpec"],
    },
  },
  {
    name: "mongodb_find_one",
    description: "Find a single document in a MongoDB collection",
    inputSchema: {
      type: "object",
      properties: {
        dbName: { type: "string", description: "Name of the database" },
        collectionName: { type: "string", description: "Name of the collection" },
        filter: { type: "object", description: "Query filter (e.g., { name: 'test' })" },
        options: { type: "object", description: "Optional find options" },
      },
      required: ["dbName", "collectionName", "filter"],
    },
  },
  {
    name: "mongodb_find_many",
    description: "Find multiple documents in a MongoDB collection",
    inputSchema: {
      type: "object",
      properties: {
        dbName: { type: "string", description: "Name of the database" },
        collectionName: { type: "string", description: "Name of the collection" },
        filter: { type: "object", description: "Query filter (e.g., { age: { $gt: 30 } })" },
        options: { type: "object", description: "Optional find options" },
      },
      required: ["dbName", "collectionName", "filter"],
    },
  },
  {
    name: "mongodb_insert_one",
    description: "Insert a single document into a MongoDB collection",
    inputSchema: {
      type: "object",
      properties: {
        dbName: { type: "string", description: "Name of the database" },
        collectionName: { type: "string", description: "Name of the collection" },
        doc: { type: "object", description: "Document to insert" },
      },
      required: ["dbName", "collectionName", "doc"],
    },
  },
  {
    name: "mongodb_insert_many",
    description: "Insert multiple documents into a MongoDB collection",
    inputSchema: {
      type: "object",
      properties: {
        dbName: { type: "string", description: "Name of the database" },
        collectionName: { type: "string", description: "Name of the collection" },
        docs: { type: "array", items: { type: "object" }, description: "Array of documents to insert" },
      },
      required: ["dbName", "collectionName", "docs"],
    },
  },
  {
    name: "mongodb_update_one",
    description: "Update a single document in a MongoDB collection",
    inputSchema: {
      type: "object",
      properties: {
        dbName: { type: "string", description: "Name of the database" },
        collectionName: { type: "string", description: "Name of the collection" },
        filter: { type: "object", description: "Filter to select the document" },
        update: { type: "object", description: "Update operations (e.g., { $set: { status: 'active' } })" },
      },
      required: ["dbName", "collectionName", "filter", "update"],
    },
  },
  {
    name: "mongodb_update_many",
    description: "Update multiple documents in a MongoDB collection",
    inputSchema: {
      type: "object",
      properties: {
        dbName: { type: "string", description: "Name of the database" },
        collectionName: { type: "string", description: "Name of the collection" },
        filter: { type: "object", description: "Filter to select documents" },
        update: { type: "object", description: "Update operations" },
      },
      required: ["dbName", "collectionName", "filter", "update"],
    },
  },
  {
    name: "mongodb_delete_one",
    description: "Delete a single document from a MongoDB collection",
    inputSchema: {
      type: "object",
      properties: {
        dbName: { type: "string", description: "Name of the database" },
        collectionName: { type: "string", description: "Name of the collection" },
        filter: { type: "object", description: "Filter to select the document to delete" },
      },
      required: ["dbName", "collectionName", "filter"],
    },
  },
  {
    name: "mongodb_delete_many",
    description: "Delete multiple documents from a MongoDB collection",
    inputSchema: {
      type: "object",
      properties: {
        dbName: { type: "string", description: "Name of the database" },
        collectionName: { type: "string", description: "Name of the collection" },
        filter: { type: "object", description: "Filter to select documents to delete" },
      },
      required: ["dbName", "collectionName", "filter"],
    },
  },
  {
    name: "mongodb_aggregate",
    description: "Perform an aggregation pipeline on a MongoDB collection",
    inputSchema: {
      type: "object",
      properties: {
        dbName: { type: "string", description: "Name of the database" },
        collectionName: { type: "string", description: "Name of the collection" },
        pipeline: { type: "array", items: { type: "object" }, description: "Aggregation pipeline stages" },
        options: { type: "object", description: "Optional aggregation options" },
      },
      required: ["dbName", "collectionName", "pipeline"],
    },
  },
];
