export class RealFile {
    private content: string = 'Contenido del archivo';

    async download(): Promise<void> {
        // Simula una descarga asincrónica
        await new Promise(resolve => setTimeout(resolve, 2000));
        console.log('Descarga completa');
    }

    getContent(): string {
        return this.content;
    }
}