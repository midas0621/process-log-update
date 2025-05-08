const { MongoClient } = require('mongodb');
const dayjs = require('dayjs');
// require('dotenv').config(); // Ensure dotenv is required to load environment variables

class MongoDBService {

  constructor(db_uri, dbName) {
    this.uri = db_uri;
    this.dbName = dbName;
    this.#registerDestructor(); // Register cleanup on GC
  }

  /**
   * Connect to MongoDB (must be called after constructor)
   */

  async connect() {

    if (this.client) return; // Reuse connection if exists

    // this.client = new MongoClient(this.uri, {
    //     tls: true,
    //     socketTimeoutMS: 45000,
    //     tlsAllowInvalidCertificates: false, // set to true only if testing with self-signed certs
    // });

    this.client = new MongoClient(this.uri, {
      connectTimeoutMS: 10000,
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
      tls: true,
      tlsAllowInvalidCertificates: false,
    });

    try {
      console.log("Attempting connection...");
      await this.client.connect(); // Wait for connection to complete
      console.log("✅ Connected to MongoDB!");
      this.db = await this.client.db(this.dbName);
      console.log("conection is completed")

    } catch (err) {
      console.error("❌ Connection failed:", err);
    }
  } catch(err) {
    console.error("error:", err);
  }

  /**
   * Explicit destructor - Manually release resources
   */

  async destroy() {
    if (this.client) {
      await this.client.close();
      this.client = null;
      this.db = null;
      console.log('MongoDB resources destroyed');
    }
  }

  /**
   * Automatic cleanup when garbage collected (fallback)
   */

  #registerDestructor() {
    const registry = new FinalizationRegistry(async (heldValue) => {
      console.warn('Auto-cleaning MongoDBService (GC)');
      await this.destroy();
    });
    registry.register(this, 'MongoDBService cleanup');
  }



  async list(collectionName) {
    try {
      if (!this.db) throw new Error('Database not connected')
      return this.db.collection(collectionName)
        .toArray();

    } catch (err) {
      console.log("error is occurred:", err)
    } finally {
      console.log("finally is occurred")
    }
  }



  async findContains(collectionName, hostname = '', ip = '', username = '') {
    try {
      const query = {
        hoame: { $regex: hostname, $options: 'i' },
        ip: { $regex: ip, $options: 'i' },
        uame: { $regex: username, $options: 'i' }
      }

      if (!this.db) throw new Error('Database not connected')
      return this.db.collection(collectionName)
        .find(query)
        .toArray();

    } catch (err) {
      console.log("error is occurred:", err)
    } finally {
      console.log("finally is occurred")
    }
  }


  async insertOne(collectionName, query) {
    console.log(query)
    let timeaction = dayjs().format('YYYY-MM-DD HH:mm:ss');
    let data = { ...query, timeaction }
    let { hoame, uame, version } = query;
    let searchQuery = {
      hoame: { $regex: hoame, $options: 'i' },
      version: { $regex: version, $options: 'i' },
      uame: { $regex: uame, $options: 'i' }
    }

    try {
      if (!this.db) throw new Error('Database not connected');
      const collection = this.db.collection(collectionName);
      const user = await collection.find(searchQuery).toArray();
      console.log("users:", user)
      if (!user.length) return collection.insertOne(data);
      else {
        console.log("user is already exist", user);
        return;
      }

    } catch (err) {
      console.log("error is occurred:", err)
    } finally {
      console.log("finally")
    }
  }

}

module.exports = MongoDBService;