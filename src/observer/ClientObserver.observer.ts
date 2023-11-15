import { DownloadObserver } from "./DownloadInterface.observer";

export class ClientObserver implements DownloadObserver {
    update(progress: number): void {
        console.log(`Descarga ${progress}% completada`);
    }
}