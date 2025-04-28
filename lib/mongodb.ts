import { MongoClient } from "mongodb"

// Check if MongoDB URI is available and valid
const validMongoURI =
  process.env.MONGODB_URI &&
  (process.env.MONGODB_URI.startsWith("mongodb://") || process.env.MONGODB_URI.startsWith("mongodb+srv://"))

// If no valid MongoDB URI is provided, create a mock client
if (!validMongoURI) {
  console.warn("Warning: Invalid or missing MONGODB_URI. Using mock MongoDB client.")
}

const uri = validMongoURI ? process.env.MONGODB_URI! : "mongodb://mock:mock@localhost:27017/mock"
const options = {}

let client
let clientPromise: Promise<MongoClient>

// Create a mock client promise if no valid URI
const createMockClientPromise = () => {
  return Promise.resolve({
    connect: () => Promise.resolve({}),
    db: () => ({
      collection: () => ({
        findOne: () => Promise.resolve(null),
        find: () => ({
          toArray: () => Promise.resolve([]),
        }),
        insertOne: () => Promise.resolve({ insertedId: "mock-id" }),
        updateOne: () => Promise.resolve({ modifiedCount: 1 }),
        deleteOne: () => Promise.resolve({ deletedCount: 1 }),
      }),
    }),
  } as unknown as MongoClient)
}

if (process.env.NODE_ENV === "development") {
  // In development mode, use a global variable so that the value
  // is preserved across module reloads caused by HMR (Hot Module Replacement).
  const globalWithMongo = global as typeof globalThis & {
    _mongoClientPromise?: Promise<MongoClient>
  }

  if (!globalWithMongo._mongoClientPromise) {
    if (validMongoURI) {
      client = new MongoClient(uri, options)
      globalWithMongo._mongoClientPromise = client.connect()
    } else {
      globalWithMongo._mongoClientPromise = createMockClientPromise()
    }
  }
  clientPromise = globalWithMongo._mongoClientPromise
} else {
  // In production mode, it's best to not use a global variable.
  if (validMongoURI) {
    client = new MongoClient(uri, options)
    clientPromise = client.connect()
  } else {
    clientPromise = createMockClientPromise()
  }
}

export default clientPromise
