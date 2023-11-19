export interface FileInterface {
    download(fileName: string): Promise<string>;
}