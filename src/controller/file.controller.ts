import { Request, Response } from 'express';
import { Socket } from 'socket.io';

import { FileView } from '../view/file.view';
import { FileProxy } from '../proxy/fileProxy.proxy';
import { CompressionInterface } from '../strategy/compressionInterface.strategy';
import { ZipCompressionStrategy } from '../strategy/zipCompression.strategy';
import { GzipCompressionStrategy } from '../strategy/gzipCompression.strategy';
import { ClientObserver } from '../observer/ClientObserver.observer';

export interface downloadOptions {
    typeCompress: string;
    fileName: string;
}

export class FileController {
    private fileView: FileView | undefined;

    public index = async (req: Request, res: Response) => {
        const files: String[] = [
            "patrones.pdf",
            "contabilidad.txt",
        ];
        this.fileView = new FileView(req, res);
        this.fileView.render({ files });
    };

    public download = async (req: Request, res: Response, socket: Socket) => {
        const { typeCompress, fileName } = req.body;
        console.log('typeCompress', typeCompress);
        console.log('fileName', fileName);
        const fileView = new FileView(req, res);
        const fileProxy = new FileProxy();
        const clientObserver = new ClientObserver(socket);
        const compressionStrategy = this.getStrategy(typeCompress);
        fileProxy.addObserver(clientObserver);
        fileProxy.download(fileName).then(async (file) => {
            const compressedContent = await compressionStrategy.compress(file);
            fileView.sendData(fileName, compressedContent);
        });
    };

    private getStrategy(typeCompress: string): CompressionInterface {
        switch (typeCompress) {
            case 'zip':
                return new ZipCompressionStrategy();
            case 'gzip':
                return new GzipCompressionStrategy();
            default:
                throw new Error('No existe estrategia');
        }
    }
}

// const fileProxy = new FileProxy();
// const zipCompressionStrategy = new ZipCompressionStrategy();
// const gzipCompressionStrategy = new GzipCompressionStrategy();

// fileProxy.addObserver(clientObserver);

// // Descarga de un archivo con compresión ZIP
// fileProxy.download("patrones.pdf").then(async (file) => {
//     // const compressedContent = await zipCompressionStrategy.compress(file);
//     const compressedContent = await gzipCompressionStrategy.compress(file);
//     console.log('Contenido comprimido:', compressedContent);
// });