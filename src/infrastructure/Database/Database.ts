import { ClientSession, Db, MongoClient, ServerApiVersion } from 'mongodb';
import config from '@application/Config/config';

export interface IDatabase {
    getDb(): Db;
    startSession(): ClientSession;
    close(): Promise<void>;
}

export class Database {
    private client: MongoClient;
    private database: Db;

    constructor() {
        this.client = new MongoClient(config.DATABASE.URI || '', {
            serverApi: {
                version: ServerApiVersion.v1,
                strict: true,
                deprecationErrors: true,
            },
        });
        this.client.connect();
        this.database = this.client.db(config.DATABASE.DB_NAME);
    }

    getDb(): Db {
        return this.database;
    }

    startSession(): ClientSession {
        return this.client.startSession();
    }

    async close(): Promise<void> {
        this.client.close();
    }
}
