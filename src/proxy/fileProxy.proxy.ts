import { DownloadObserver } from "../observer/DownloadInterface.observer";
import { FileInterface } from "./fileInterface.proxy";
import { RealFile } from "./realFIle.proxy";

export class FileProxy implements FileInterface {
    private realFile: RealFile | null = null;
    private observers: DownloadObserver[] = [];

    addObserver(observer: DownloadObserver): void {
        this.observers.push(observer);
    }

    async download(): Promise<void> {
        if (!this.realFile) {
            this.realFile = new RealFile();
            for (let i = 0; i <= 100; i += 10) {
                await new Promise(resolve => setTimeout(resolve, 500));
                this.notifyObservers(i);
            }
            console.log('Descarga completa');
        }
    }

    getContent(): string {
        return this.realFile ? this.realFile.getContent() : 'Archivo no descargado';
    }

    private notifyObservers(progress: number): void {
        this.observers.forEach(observer => observer.update(progress));
    }
}