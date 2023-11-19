import fs from 'fs';

export class RealFile {
    private dir: string = 'src/files/';
    private isFulfilled: boolean = false;

    async download(fileName: string): Promise<string> {
        this.isFulfilled = false;
        const content = fs.readFileSync(this.dir + fileName, 'utf-8');
        this.isFulfilled = true;
        return content;
    }

    isDownloadFulfilled(): boolean {
        return this.isFulfilled;
    }
}