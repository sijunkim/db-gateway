import { MongoClient, Db, Collection, Document, Filter, UpdateFilter, FindOptions, AggregateOptions, IndexSpecification } from "mongodb";
import { Database } from "../Database";
import { MongoDbSpecificOperations } from "./MongoDbSpecificOperations";

export class MongoDbOperations implements Database, MongoDbSpecificOperations {
  private client: MongoClient | null = null;
  private dbInstance: Db | null = null;

  async connect(): Promise<void> {
    const uri = process.env.MONGODB_URI;
    if (!uri) {
      throw new Error("MONGODB_URI is not defined in environment variables.");
    }
    this.client = new MongoClient(uri);
    await this.client.connect();
    this.dbInstance = this.client.db(); // Default DB, can be changed by tools
    console.error("MongoDB connection established successfully");
  }

  async disconnect(): Promise<void> {
    if (this.client) {
      await this.client.close();
      console.error("Disconnected from MongoDB.");
    }
  }

  getOperations(): MongoDbSpecificOperations {
    return this;
  }

  getDb(): Db {
    if (!this.dbInstance) {
      throw new Error("MongoDB client not connected.");
    }
    return this.dbInstance;
  }

  private getCollection(dbName: string, collectionName: string): Collection<Document> {
    if (!this.client) {
      throw new Error("MongoDB client not connected.");
    }
    return this.client.db(dbName).collection(collectionName);
  }

  async listDatabases(): Promise<any> {
    if (!this.client) {
      throw new Error("MongoDB client not connected.");
    }
    const adminDb = this.client.db().admin();
    const { databases } = await adminDb.listDatabases();
    return databases;
  }

  async listCollections(dbName?: string): Promise<any> {
    if (!this.client) {
      throw new Error("MongoDB client not connected.");
    }
    const targetDb = dbName ? this.client.db(dbName) : this.getDb();
    const collections = await targetDb.listCollections().toArray();
    return collections;
  }

  async dropCollection(dbName: string, collectionName: string): Promise<any> {
    const collection = this.getCollection(dbName, collectionName);
    const result = await collection.drop();
    return { acknowledged: result };
  }

  async createIndex(dbName: string, collectionName: string, fieldSpec: IndexSpecification, options?: Document): Promise<string> {
    const collection = this.getCollection(dbName, collectionName);
    const indexName = await collection.createIndex(fieldSpec, options);
    return indexName;
  }

  async findOne(dbName: string, collectionName: string, filter: Filter<Document>, options?: FindOptions<Document>): Promise<Document | null> {
    const collection = this.getCollection(dbName, collectionName);
    return collection.findOne(filter, options);
  }

  async findMany(dbName: string, collectionName: string, filter: Filter<Document>, options?: FindOptions<Document>): Promise<Document[]> {
    const collection = this.getCollection(dbName, collectionName);
    return collection.find(filter, options).toArray();
  }

  async insertOne(dbName: string, collectionName: string, doc: Document): Promise<any> {
    const collection = this.getCollection(dbName, collectionName);
    const result = await collection.insertOne(doc);
    return { insertedId: result.insertedId };
  }

  async insertMany(dbName: string, collectionName: string, docs: Document[]): Promise<any> {
    const collection = this.getCollection(dbName, collectionName);
    const result = await collection.insertMany(docs);
    return { insertedIds: result.insertedIds };
  }

  async updateOne(dbName: string, collectionName: string, filter: Filter<Document>, update: UpdateFilter<Document>): Promise<any> {
    const collection = this.getCollection(dbName, collectionName);
    const result = await collection.updateOne(filter, update);
    return { matchedCount: result.matchedCount, modifiedCount: result.modifiedCount };
  }

  async updateMany(dbName: string, collectionName: string, filter: Filter<Document>, update: UpdateFilter<Document>): Promise<any> {
    const collection = this.getCollection(dbName, collectionName);
    const result = await collection.updateMany(filter, update);
    return { matchedCount: result.matchedCount, modifiedCount: result.modifiedCount };
  }

  async deleteOne(dbName: string, collectionName: string, filter: Filter<Document>): Promise<any> {
    const collection = this.getCollection(dbName, collectionName);
    const result = await collection.deleteOne(filter);
    return { deletedCount: result.deletedCount };
  }

  async deleteMany(dbName: string, collectionName: string, filter: Filter<Document>): Promise<any> {
    const collection = this.getCollection(dbName, collectionName);
    const result = await collection.deleteMany(filter);
    return { deletedCount: result.deletedCount };
  }

  async aggregate(dbName: string, collectionName: string, pipeline: Document[], options?: AggregateOptions): Promise<Document[]> {
    const collection = this.getCollection(dbName, collectionName);
    return collection.aggregate(pipeline, options).toArray();
  }
}
