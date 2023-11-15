import { CompressionInterface } from "./compressionInterface.strategy";

export class ZipCompressionStrategy implements CompressionInterface {
    compress(content: string): string {
        // Implementa la lógica de compresión ZIP
        console.log('Compresión ZIP aplicada');
        return content; // En este ejemplo, simplemente devuelve el contenido original
    }
}