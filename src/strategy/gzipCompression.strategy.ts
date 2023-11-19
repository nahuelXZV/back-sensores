import { CompressionInterface } from "./compressionInterface.strategy";
import * as zlib from 'zlib';

export class GzipCompressionStrategy implements CompressionInterface {

    compress(content: string): Buffer {
        const compressedContent = zlib.gzipSync(content);
        console.log('Compresión GZIP aplicada');
        return compressedContent;
    }

}