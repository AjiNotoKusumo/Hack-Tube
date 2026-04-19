import { MongoClient } from 'mongodb';

const client = new MongoClient(process.env.MONGODB_URI);
const database = client.db('gc01');

export default database;
