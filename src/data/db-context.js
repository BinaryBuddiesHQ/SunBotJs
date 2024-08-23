const { MongoClient } = require('mongodb');
const { mongodb } = require('../config.json');

class MongoDb {
  client;
  context;
  connected;

  constructor() {
    if (!mongodb?.connectionString) {
      console.log("No MongoDB connection string found. Skipping database initialization.");
      return;
    }

    if (MongoDb.instance)
      return MongoDb.instance;

    // HACK: don't async in ctor
    (async () => {
      try {
        this.client = new MongoClient(mongodb.connectionString);
        await this.client.connect();

        this.context = this.client.db(mongodb.database);
        console.log('MongoDB connection established.');
        this.connected = true;

      } catch (error) {
        console.error('Failed to connect to MongoDB.', error);
        this.connected = false;
      }

      MongoDb.instance = this;
    })();
  }

  async createOrUpdateAsync(collectionName, id, data) {
    const collection = this.context.collection(collectionName);

    const query = { id: id };
    const update = { $set: data };
    const options = { upsert: true };

    const result = await collection.updateOne(query, update, options);
    // TODO: handle result
  }

  async getAsync(collectionName, id) {
    const collection = this.context.collection(collectionName);
    const query = { id: id };
    return collection.findOne(query);
  }

  // TODO: implement
  async deleteAsync(collectionName, id) {
    console.error("NOT IMPLEMENTED");
  }
}


module.exports = { mongodb: new MongoDb() };