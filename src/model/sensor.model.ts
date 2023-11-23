import { QueryResult } from "pg";
import { DBConection, db } from "../config/db";
import { Data, DataModel } from "./data.model";

export interface Sensor {
    id?: number;
    nombre: string;
    puerto: string;
    longitud: string;
    latitud: string;
    imagen: string;
    estado: string;
    data?: Data[];
}

export class SensorModel {

    private dbConexion: DBConection;
    private dataModel: DataModel;
    public id: number;
    public nombre: string;
    public puerto: string;
    public longitud: string;
    public latitud: string;
    public imagen: string;
    public estado: string;

    constructor(sensor: Sensor | undefined) {
        const { nombre, id, puerto, longitud, latitud, imagen, estado } = sensor || {};
        this.dbConexion = new db();
        this.dataModel = new DataModel(undefined);
        this.nombre = nombre || "";
        this.id = id || 0;
        this.puerto = puerto || "";
        this.longitud = longitud || "";
        this.latitud = latitud || "";
        this.imagen = imagen || "";
        this.estado = estado || "Normal";
    }

    public async getAll(): Promise<Sensor[] | undefined> {
        const client = await this.dbConexion.connect();
        try {
            const result = await client.query('SELECT sensor.* FROM sensor');
            return await this.formatearDatos(result);
        } catch (error) {
            console.error('Error al ejecutar la consulta:', error);
        } finally {
            await this.dbConexion.disconnect();
        }
    }

    public async getOne(id: number): Promise<Sensor | undefined> {
        const client = await this.dbConexion.connect();
        try {
            const result = await client.query('SELECT * FROM sensor WHERE id = $1', [id]);
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
            const id = await client.query('SELECT MAX(id) FROM Sensor');
            this.id = id.rows[0].max + 1;
            const result = await client.query('INSERT INTO sensor(id, nombre, puerto, longitud, latitud, imagen, estado) VALUES($1, $2, $3, $4, $5, $6, $7)', [this.id, this.nombre, this.puerto, this.longitud, this.latitud, this.imagen, this.estado]);
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
            const result = await client.query('UPDATE sensor SET nombre = $1, puerto = $2, longitud = $3, latitud = $4, imagen = $5, estado = $6 WHERE id = $7', [this.nombre, this.puerto, this.longitud, this.latitud, this.imagen, this.estado, this.id]);
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
            const result = await client.query('DELETE FROM sensor WHERE id = $1', [id]);
            return result;
        } catch (error) {
            console.error('Error al ejecutar la consulta:', error);
        } finally {
            await this.dbConexion.disconnect();
        }
    }

    private async formatearDatos(data: QueryResult): Promise<Sensor[]> {
        const { rows } = data;
        const sensors = await Promise.all(rows.map(async (item: any) => {
            const { id, nombre, puerto, longitud, latitud, imagen, estado } = item;
            const dataSensor = await this.dataModel.getAll(id);
            return {
                id,
                nombre,
                puerto,
                longitud,
                latitud,
                imagen,
                estado,
                data: dataSensor
            }
        }));
        return sensors;
    }

    private async formatearDato(data: QueryResult): Promise<Sensor> {
        const { rows } = data;
        const { id, nombre, puerto, longitud, latitud, imagen, estado } = rows[0];
        const dataSensor = await this.dataModel.getAll(id);
        return {
            id,
            nombre,
            puerto,
            longitud,
            latitud,
            estado,
            imagen,
            data: dataSensor
        }
    }
}