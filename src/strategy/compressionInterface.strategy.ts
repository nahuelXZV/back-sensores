export interface CompressionInterface {
  compress(content: string): Buffer | Promise<Buffer>;
}