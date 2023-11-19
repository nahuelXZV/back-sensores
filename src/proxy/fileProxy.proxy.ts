import { DownloadObserver } from "../observer/DownloadInterface.observer";
import { FileInterface } from "./fileInterface.proxy";
import { RealFile } from "./realFIle.proxy";
import fs from 'fs';

export class FileProxy implements FileInterface {
    private realFile: RealFile | null = null;
    private observers: DownloadObserver[] = [];

    addObserver(observer: DownloadObserver): void {
        this.observers.push(observer);
    }

    async download(fileName: string): Promise<string> {
        if (!this.validateFile(fileName)) return "";
        if (!this.realFile) this.realFile = new RealFile();

        let downloadPromise = this.realFile.download(fileName);
        for (let i = 0; i <= 100; i += 10) {
            if (i < 20 || !this.realFile.isDownloadFulfilled()) {
                this.notifyObservers(i);
            } else {
                this.notifyObservers(100);
                console.log('Descarga completa');
                break;
            }
        }
        return await downloadPromise;
    }

    private validateFile(fileName: string): boolean {
        if (!fs.existsSync("files/" + fileName)) {
            console.log('El archivo no existe');
            return false;
        }
        return true;
    }

    private notifyObservers(progress: number): void {
        this.observers.forEach(observer => observer.update(progress));
    }
}