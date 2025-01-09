export interface IFileSystemAdapter {
  isDirectory(path: string): boolean;
  directoryExists(directoryPath: string): boolean;
  createDirectory(directoryPath: string, recursive?: boolean): boolean;
  removeDirectory(directoryPath: string, recursive?: boolean): boolean;

  isFile(path: string): boolean;
  fileExists(filePath: string): boolean;
  removeFile(filePath: string): boolean;
  getFiles(
    directoryPath: string,
    encoding?: 'utf8' | 'base64',
    recurse?: boolean
  ): string[] | undefined;
  getFilesAsync(
    directoryPath: string,
    encoding?: 'utf8' | 'base64',
    recurse?: boolean
  ): Promise<string[]>;

  readFile(filePath: string, encoding?: 'utf8' | 'base64'): string | undefined;
  readFileAsync(
    filePath: string,
    encoding?: 'utf8' | 'base64'
  ): Promise<string | undefined>;
  writeFile(filePath: string, content: string, replace?: boolean): boolean;
  writeFileAsync(
    filePath: string,
    content: string,
    replace?: boolean
  ): Promise<boolean>;
}
