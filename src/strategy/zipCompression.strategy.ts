import { CompressionInterface } from "./compressionInterface.strategy";
import JSZip from 'jszip';

export class ZipCompressionStrategy implements CompressionInterface {

    async compress(content: string): Promise<Buffer> {
        const zip = new JSZip();
        zip.file("file.zip", content, { binary: false });
        const data = await zip.generateAsync({ type: "nodebuffer" });
        console.log('Compresión ZIP aplicada');
        return data;
    }
}