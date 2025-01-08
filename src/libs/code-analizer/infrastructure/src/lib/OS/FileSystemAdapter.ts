import { IFileSystemAdapter, TYPES } from '@code-analizer/application';
import * as fs from 'fs';
import { inject, injectable } from 'inversify';
import { ConsoleAdapter } from './ConsoleAdapter';

@injectable()
export class FileSystemAdapter implements IFileSystemAdapter {
  private consoleAdapter: ConsoleAdapter;

  constructor(@inject(TYPES.IConsoleAdapter) consoleAdapter: ConsoleAdapter) {
    this.consoleAdapter = consoleAdapter;
  }

  public directoryExists(directoryPath: string): boolean {
    try {
      const stat = fs.statSync(directoryPath);
      if (!stat.isDirectory()) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const error: any = new Error('Path is not a directory');
        error.code = 'ENOTDIR';
        throw error;
      }
      return fs.existsSync(directoryPath);
    } catch (e) {
      this.setError(e, { path: directoryPath });
    }
    return false;
  }

  public createDirectory(directoryPath: string, recursive?: boolean): boolean {
    try {
      fs.mkdirSync(directoryPath, { recursive });
      return true;
    } catch (e) {
      this.setError(e, { path: directoryPath, recursive });
    }
    return false;
  }

  public removeDirectory(directoryPath: string, recursive?: boolean): boolean {
    try {
      fs.rmdirSync(directoryPath, { recursive });
      return true;
    } catch (e) {
      this.setError(e, { path: directoryPath, recursive });
    }
    return false;
  }

  public fileExists(filePath: string): boolean {
    try {
      const stat = fs.statSync(filePath);
      if (!stat.isFile()) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const error: any = new Error('Path is not a file');
        error.code = 'EISDIR';
        throw error;
      }
      return fs.existsSync(filePath);
    } catch (e) {
      this.setError(e, { path: filePath });
    }
    return false;
  }

  public removeFile(filePath: string): boolean {
    try {
      const stat = fs.statSync(filePath);
      if (!stat.isFile()) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const error: any = new Error('Path is not a file');
        error.code = 'EISDIR';
        throw error;
      }
      fs.rmSync(filePath);
      return true;
    } catch (e) {
      this.setError(e, { path: filePath });
    }
    return false;
  }

  public getFiles(
    directoryPath: string,
    encoding: 'utf8' | 'base64' = 'utf8'
  ): string[] {
    try {
      const files = fs.readdirSync(directoryPath, encoding);
      return files;
    } catch (e) {
      this.setError(e, { path: directoryPath, encoding });
    }
    return [];
  }

  public async getFilesAsync(
    directoryPath: string,
    encoding: 'utf8' | 'base64' = 'utf8'
  ): Promise<string[]> {
    try {
      const files = await fs.promises.readdir(directoryPath, encoding);
      return files;
    } catch (e) {
      this.setError(e, { path: directoryPath, encoding });
    }
    return [];
  }

  public readFile(
    filePath: string,
    encoding: 'utf8' | 'base64' = 'utf8'
  ): string | undefined {
    try {
      return fs.readFileSync(filePath, encoding);
    } catch (e) {
      this.setError(e, { path: filePath, encoding });
    }
    return undefined;
  }

  public async readFileAsync(
    filePath: string,
    encoding: 'utf8' | 'base64' = 'utf8'
  ): Promise<string | undefined> {
    try {
      return await fs.promises.readFile(filePath, encoding);
    } catch (e) {
      this.setError(e, { path: filePath, encoding });
    }
    return undefined;
  }

  public writeFile(
    filePath: string,
    content: string,
    replace?: boolean
  ): boolean {
    try {
      fs.writeFileSync(filePath, content, { flag: replace ? 'w' : 'wx' });
      return true;
    } catch (e) {
      this.setError(e, { path: filePath, replace });
    }
    return false;
  }
  async writeFileAsync(
    filePath: string,
    content: string,
    replace?: boolean
  ): Promise<boolean> {
    try {
      await fs.promises.writeFile(filePath, content, {
        flag: replace ? 'w' : 'wx',
      });
      return true;
    } catch (e) {
      this.setError(e, { path: filePath, replace });
    }
    return false;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private setError(e: any, options: { path: string } & { [key: string]: any }) {
    const params = { ...options, cause: e };
    switch (e.code) {
      case 'EEXIST':
        this.consoleAdapter.error('Path already exists', params);
        break;

      case 'ENOENT':
        this.consoleAdapter.error('Path not exists', params);
        break;

      case 'ENOTDIR':
        this.consoleAdapter.error('A directory is expected', params);
        break;

      case 'EACCES':
        this.consoleAdapter.error('Permission denied', params);
        break;

      case 'EISDIR':
        this.consoleAdapter.error('Path is a directory', params);
        break;

      case 'EPERM':
        this.consoleAdapter.error('Operation not permitted', params);
        break;

      default:
        this.consoleAdapter.error(e.message);
        this.consoleAdapter.error('An unexpected error occurs', params);
        break;
    }
  }
}
