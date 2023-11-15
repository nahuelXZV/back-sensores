export interface DownloadObserver {
    update(progress: number): void;
}