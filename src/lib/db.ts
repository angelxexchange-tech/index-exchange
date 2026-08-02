import mongoose from "mongoose";

const MONGO_DB_URI = process.env.MONGO_DB_URI;

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  // eslint-disable-next-line no-var
  var mongooseCache: MongooseCache | undefined;
}

let cached = global.mongooseCache;

if (!cached) {
  cached = global.mongooseCache = { conn: null, promise: null };
}

export async function connectToDatabase(): Promise<typeof mongoose> {
  if (!MONGO_DB_URI) {
    throw new Error("Please define the MONGO_DB_URI environment variable inside .env");
  }

  if (cached?.conn) {
    return cached.conn;
  }

  if (!cached?.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached!.promise = mongoose.connect(MONGO_DB_URI as string, opts).then((mongooseInstance) => {
      return mongooseInstance;
    });
  }

  try {
    cached!.conn = await cached!.promise;
  } catch (e) {
    cached!.promise = null;
    throw e;
  }

  return cached!.conn;
}
