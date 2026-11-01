import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI || "";

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

if (uri) {
  client = new MongoClient(uri);
  clientPromise = client.connect();
} else {
  clientPromise = Promise.reject(new Error("MONGODB_URI is not configured"));
}

export default clientPromise;

