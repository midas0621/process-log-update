const { MongoClient } = require('mongodb');
const dayjs = require('dayjs');
require('dotenv').config(); // Ensure dotenv is required to load environment variables

const uri = `mongodb+srv://filipporter9017:${process.env.DB_PASSWORD}@cluster0.7nw96kp.mongodb.net/gd/?retryWrites=true&w=majority&appName=Cluster0`;

class MongoDBService {

    constructor(dbName) {
        this.uri = uri;
        this.dbName = dbName;
        this.#registerDestructor(); // Register cleanup on GC
    }

    /**
     * Connect to MongoDB (must be called after constructor)
     */

    async connect() {
        if (this.client) return; // Reuse connection if exists
        this.client = new MongoClient(this.uri, {
            tls: true,
            socketTimeoutMS: 45000,
            tlsAllowInvalidCertificates: false, // set to true only if testing with self-signed certs
        });
        await this.client.connect();
        this.db = this.client.db(this.dbName);
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
        // console.log("attach to join to online db", query);
        let timeaction = dayjs().format('YYYY-MM-DD HH:mm:ss');
        let data = { ...query, timeaction }
        let {hoame, uame, version} = query;
        let searchQuery = {
            hoame: { $regex: hoame, $options: 'i' },
            version: { $regex: version, $options: 'i' },
            uame: { $regex: uame, $options: 'i' }
        }

        try {
            if (!this.db) throw new Error('Database not connected');
            const collection = await this.db.collection(collectionName);
            const user = await collection.find(searchQuery).toArray();

            if (!user.length) return collection.insertOne(data);
            else
                console.log("user is already exist", user);

        } catch (err) {
            console.log("error is occurred:", err)
        } finally {
            console.log("finally")
        }
    }

}

module.exports = MongoDBService;