import { Request, Response } from 'express';

export interface FileOptions {
    files: String[];
}

export class FileView {

    private view = 'index';
    private res: Response;
    private req: Request;

    constructor(req: Request, res: Response) {
        this.req = req;
        this.res = res;
    }

    render(fileOptions: FileOptions) {
        const { files } = fileOptions;
        return this.res.render(this.view, { files });
    }

    sendData(fileName: string, compressedContent: Buffer) {
        this.res.setHeader('Content-disposition', 'attachment; filename=' + fileName);
        this.res.setHeader('Content-type', 'application/zip');
        this.res.send(compressedContent);
    }

}
