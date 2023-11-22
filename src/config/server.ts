import express from 'express';
import * as http from 'http';
import { SensorController } from '../controller/sensor.controller';
const socketIo = require('socket.io');
import { SerialPort } from 'serialport'

interface Options {
    port: number;
}

export class Server {
    private app = express();
    private readonly port: number;

    constructor(options: Options) {
        const { port } = options;
        this.port = port;
    }

    async start() {

        const server = http.createServer(this.app);
        const io = socketIo(server);

        //* Middlewares
        this.app.use(express.json()); // raw
        this.app.use(express.urlencoded({ extended: true }));

        const sensorController: SensorController = new SensorController();

        this.app.get('/sensor', (req, res) => sensorController.getAll(req, res, io));
        this.app.get('/sensor/:id', (req, res) => sensorController.getOne(req, res, io));
        this.app.post('/sensor', (req, res) => sensorController.create(req, res, io));
        this.app.put('/sensor/:id', (req, res) => sensorController.edit(req, res, io));

        io.on('connection', (socket: any) => {
            console.log('a user connected');
        });

        server.listen(this.port, () => {
            console.log(`Server running on port ${this.port}`);
        });

        const port = new SerialPort({
            path: 'COM3',
            baudRate: 9600,
        });

        SerialPort.list().then(ports => {
            console.log('Puertos disponibles:');
            ports.forEach(port => console.log(port.path));
        });

        port.on('open', () => {
            console.log('Puerto Abierto');
        });


        port.on('data', function (data: Buffer) {
            // mostrar la data del buffer
            console.log('Data:', data.toString('utf-8'))
        })

        // port.on('readable', function () {
        //     console.log('Data:', port.read())
        // })
    }
}