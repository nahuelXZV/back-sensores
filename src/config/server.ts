import express, { Router } from 'express';
import methodOverride from 'method-override';
import path from 'path';
import { FileProxy } from '../proxy/fileProxy.proxy';
import { ZipCompressionStrategy } from '../strategy/zipCompression.strategy';
import { ClientObserver } from '../observer/clientObserver.observer';

interface Options {
    port: number;
    routes: Router;
    public_path?: string;
}

export class Server {
    private app = express();
    private readonly port: number;
    private readonly publicPath: string;
    private readonly routes: Router;

    constructor(options: Options) {
        const { port, routes, public_path = 'public' } = options;
        this.port = port;
        this.publicPath = public_path;
        this.routes = routes;
    }

    async start() {
        //* Middlewares
        this.app.use(express.json()); // raw
        this.app.use(express.urlencoded({ extended: true }));
        this.app.use(methodOverride('_method'));

        //* View Engine
        this.app.set('views', path.join(__dirname, '../resource'));
        this.app.set('view engine', 'ejs');

        //* Public Folder
        this.app.use(express.static(this.publicPath));

        //* Routes
        this.app.use(this.routes);

        this.app.listen(this.port, () => {
            console.log(`Server running on port ${this.port}`);
        });

        const fileProxy = new FileProxy();
        const zipCompressionStrategy = new ZipCompressionStrategy();
        const clientObserver = new ClientObserver();

        fileProxy.addObserver(clientObserver);

        // Descarga de un archivo con compresión ZIP
        fileProxy.download().then(() => {
            const compressedContent = zipCompressionStrategy.compress(fileProxy.getContent());
            console.log('Contenido comprimido:', compressedContent);
        });
    }
}