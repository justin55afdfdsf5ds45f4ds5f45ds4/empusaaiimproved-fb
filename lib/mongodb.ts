import { MongoClient } from "mongodb"

// Check if the MongoDB URI is defined
if (!process.env.MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable")
}

// Parse the MongoDB URI to ensure it's valid
const uri = process.env.MONGODB_URI
try {
  // Test if the URI is valid by creating a URL object
  new URL(uri)
} catch (error) {
  console.error("Invalid MongoDB URI:", error)
  throw new Error("Invalid MongoDB URI format")
}

const options = {}

// Global is used here to maintain a cached connection across hot reloads
// in development. This prevents connections growing exponentially
// during API Route usage.
let cached = global.mongoClientPromise

if (!cached) {
  cached = global.mongoClientPromise = {
    client: null,
    promise: null,
  }
}

export async function connectToDatabase() {
  if (cached.client) {
    return cached.client
  }

  if (!cached.promise) {
    const client = new MongoClient(uri, options)
    cached.promise = client
      .connect()
      .then((client) => {
        return client
      })
      .catch((error) => {
        console.error("Failed to connect to MongoDB:", error)
        throw error
      })
  }
  cached.client = await cached.promise
  return cached.client
}

// Export a module-scoped MongoClient promise
const clientPromise = (async () => {
  return await connectToDatabase()
})()

export default clientPromise
