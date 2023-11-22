import { QueryResult } from "pg";
import { DBConection, db } from "../config/db";

export interface Data {
    id?: number;
    fecha: string;
    hora: string;
    valor: string;
    sensor_id: number;
}

export class DataModel {

    private dbConexion: DBConection;
    public id: number;
    public fecha: string;
    public hora: string;
    public valor: string;
    public sensor_id: number;

    constructor(data: Data | undefined) {
        const { id, fecha, hora, sensor_id, valor } = data || {};
        this.dbConexion = new db();
        this.id = id || 0;
        this.fecha = fecha || "";
        this.hora = hora || "";
        this.sensor_id = sensor_id || 0;
        this.valor = valor || "";
    }

    public async getAll(id: number): Promise<Data[] | undefined> {
        const client = await this.dbConexion.connect();
        try {
            const result = await client.query('SELECT data.* FROM data WHERE sensor_id = $1', [id]);
            return await this.formatearDatos(result);
        } catch (error) {
            console.error('Error al ejecutar la consulta:', error);
        } finally {
            await this.dbConexion.disconnect();
        }
    }

    public async getOne(id: number): Promise<Data | undefined> {
        const client = await this.dbConexion.connect();
        try {
            const result = await client.query('SELECT * FROM data WHERE id = $1', [id]);
            return await this.formatearDato(result);
        } catch (error) {
            console.error('Error al ejecutar la consulta:', error);
        } finally {
            await this.dbConexion.disconnect();
        }
    }

    public async store() {
        const client = await this.dbConexion.connect();
        try {
            const id = await client.query('SELECT MAX(id) FROM data');
            this.id = id.rows[0].max + 1;
            const result = await client.query('INSERT INTO data (id, fecha, hora, valor, sensor_id) VALUES ($1, $2, $3, $4, $5)', [this.id, this.fecha, this.hora, this.valor, this.sensor_id]);
            return result;
        } catch (error) {
            console.error('Error al ejecutar la consulta:', error);
        } finally {
            await this.dbConexion.disconnect();
        }
    }

    public async update() {
        const client = await this.dbConexion.connect();
        try {
            const result = await client.query('UPDATE data SET fecha = $1, hora = $2, valor = $3, sensor_id = $4 WHERE id = $5', [this.fecha, this.hora, this.valor, this.sensor_id, this.id]);
            return result;
        } catch (error) {
            console.error('Error al ejecutar la consulta:', error);
        } finally {
            await this.dbConexion.disconnect();
        }
    }

    public async delete(id: number) {
        const client = await this.dbConexion.connect();
        try {
            const result = await client.query('DELETE FROM data WHERE id = $1', [id]);
            return result;
        } catch (error) {
            console.error('Error al ejecutar la consulta:', error);
        } finally {
            await this.dbConexion.disconnect();
        }
    }

    private async formatearDatos(data: QueryResult): Promise<Data[]> {
        const { rows } = data;
        return rows.map((item: any) => {
            const { id, sensor_id, fecha, hora, valor } = item;
            return {
                id,
                sensor_id,
                fecha,
                hora,
                valor
            }
        });
    }

    private async formatearDato(data: QueryResult): Promise<Data> {
        const { rows } = data;
        const { id, sensor_id, fecha, hora, valor } = rows[0];
        return {
            id,
            sensor_id,
            fecha,
            hora,
            valor
        }
    }
}