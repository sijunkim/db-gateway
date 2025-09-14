import { Db, Collection, Document, Filter, UpdateFilter, FindOptions, AggregateOptions, IndexSpecification } from "mongodb";

export interface MongoDbSpecificOperations {
  getDb(): Db;
  listDatabases(): Promise<any>;
  listCollections(dbName?: string): Promise<any>;
  dropCollection(dbName: string, collectionName: string): Promise<any>;
  createIndex(dbName: string, collectionName: string, fieldSpec: IndexSpecification, options?: Document): Promise<string>;
  
  findOne(dbName: string, collectionName: string, filter: Filter<Document>, options?: FindOptions<Document>): Promise<Document | null>;
  findMany(dbName: string, collectionName: string, filter: Filter<Document>, options?: FindOptions<Document>): Promise<Document[]>;
  insertOne(dbName: string, collectionName: string, doc: Document): Promise<any>;
  insertMany(dbName: string, collectionName: string, docs: Document[]): Promise<any>;
  updateOne(dbName: string, collectionName: string, filter: Filter<Document>, update: UpdateFilter<Document>): Promise<any>;
  updateMany(dbName: string, collectionName: string, filter: Filter<Document>, update: UpdateFilter<Document>): Promise<any>;
  deleteOne(dbName: string, collectionName: string, filter: Filter<Document>): Promise<any>;
  deleteMany(dbName: string, collectionName: string, filter: Filter<Document>): Promise<any>;
  aggregate(dbName: string, collectionName: string, pipeline: Document[], options?: AggregateOptions): Promise<Document[]>;
}
