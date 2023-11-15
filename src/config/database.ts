import { Client } from 'pg';

export interface dbConfig {
    user: string;
    password: string;
    host: string;
    database: string;
    port: number;
}

const dbConfig: dbConfig = {
    user: "postgres",
    password: "postgres2023",
    host: "nahuelxzv.pro",
    database: "singleton",
    port: 5432,
};

export class Database {
    private static instancia: Database;
    private client?: Client;

    private constructor() {
    }

    public static getInstancia(): Database {
        if (!Database.instancia) {
            Database.instancia = new Database();
        }
        return Database.instancia;
    }

    public async connect(): Promise<Client> {
        this.client = new Client(dbConfig);
        try {
            await this.client.connect();
        } catch (error) {
            console.error('Error al conectar a la base de datos:', error);
        }
        return this.client;
    }

    public async disconnect(): Promise<void> {
        await this.client?.end();
    }
}
