import { CompressionInterface } from "./compressionInterface.strategy";

export class GzipCompressionStrategy implements CompressionInterface {
    compress(content: string): string {
        // Implementa la lógica de compresión GZIP
        console.log('Compresión GZIP aplicada');
        return content; // En este ejemplo, simplemente devuelve el contenido original
    }
}