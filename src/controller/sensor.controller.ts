import { Request, Response } from 'express';
import { Socket } from 'socket.io';
import { SensorModel } from '../model/sensor.model';

export class SensorController {

    private sensorModel: SensorModel | undefined;

    // crear
    public create = async (req: Request, res: Response, socket: Socket) => {
        const { nombre, puerto, longitud, latitud, imagen } = req.body;
        this.sensorModel = new SensorModel({ nombre, puerto, longitud, latitud, imagen });
        const result = await this.sensorModel.store();
        res.json({
            message: 'Sensor creado correctamente',
            result
        });
    };

    // editar
    public edit = async (req: Request, res: Response, socket: Socket) => {
        const { nombre, puerto, longitud, latitud, imagen } = req.body;
        const { id } = req.params;
        this.sensorModel = new SensorModel({ id: parseInt(id), nombre, puerto, longitud, latitud, imagen });
        const result = await this.sensorModel.update();
        res.json({
            message: 'Sensor actualizado correctamente',
            result
        });
    };

    // ver todos
    public getAll = async (req: Request, res: Response, socket: Socket) => {
        this.sensorModel = new SensorModel(undefined);
        const result = await this.sensorModel.getAll();
        res.json(result);
    };

    // ver uno
    public getOne = async (req: Request, res: Response, socket: Socket) => {
        const { id } = req.params;
        this.sensorModel = new SensorModel(undefined);
        const result = await this.sensorModel.getOne(parseInt(id));
        res.json(result);
    };



}
