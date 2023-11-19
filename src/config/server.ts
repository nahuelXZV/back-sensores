import express, { Router } from 'express';
import path from 'path';
import * as http from 'http';
const socketIo = require('socket.io');

import { FileController } from '../controller/file.controller';

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

        //* View Engine
        this.app.set('views', path.join(__dirname, '../resource'));
        this.app.set('view engine', 'ejs');

        const fileController = new FileController();

        this.app.get('/', fileController.index);
        this.app.post('/download', (req, res) => fileController.download(req, res, io));

        io.on('connection', (socket: any) => {
            console.log('a user connected');
        });

        server.listen(this.port, () => {
            console.log(`Server running on port ${this.port}`);
        });
    }
}