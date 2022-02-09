
import { Schema } from 'mongoose';
import * as dotenv from "dotenv";

dotenv.config();

const uri = `mongodb://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@cluster0-shard-00-00.mvvoj.mongodb.net:27017,cluster0-shard-00-01.mvvoj.mongodb.net:27017,cluster0-shard-00-02.mvvoj.mongodb.net:27017/myFirstDatabase?ssl=true&replicaSet=atlas-apu9uh-shard-0&authSource=admin&retryWrites=true&w=majority`;

// connect(uri)

export interface User {
  wallet: string;
  username: string;
}

const schema = new Schema<User>({
  wallet: { type: String, required: true },
  username: String
});


export { uri, schema }
