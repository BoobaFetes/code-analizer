import {
  ApplicationTypes,
  IFileSystemAdapter,
} from '@code-analyser/appplication';
import * as fs from 'fs';
import { inject, injectable } from 'inversify';
import * as path from 'path';
import { ConsoleAdapter } from './ConsoleAdapter';

@injectable()
export class FileSystemAdapter implements IFileSystemAdapter {
  private consoleAdapter: ConsoleAdapter;

  constructor(
    @inject(ApplicationTypes.ConsoleAdapter) consoleAdapter?: ConsoleAdapter
  ) {
    if (!consoleAdapter) {
      throw new Error('ConsoleAdapter is required');
    }

    this.consoleAdapter = consoleAdapter;
  }

  public isDirectory(path: string): boolean {
    try {
      return fs.statSync(path).isDirectory();
    } catch (e) {
      this.setError(e, { path });
    }
    return false;
  }

  public directoryExists(directoryPath: string): boolean {
    try {
      const exists = fs.existsSync(directoryPath);
      if (exists && !this.isDirectory(directoryPath)) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const error: any = new Error('Path is not a directory');
        error.code = 'ENOTDIR';
        throw error;
      }
      return exists;
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

  public isFile(path: string): boolean {
    try {
      return fs.statSync(path).isFile();
    } catch (e) {
      this.setError(e, { path });
    }
    return false;
  }
  public fileExists(filePath: string): boolean {
    try {
      const exists = fs.existsSync(filePath);
      if (exists && !this.isFile(filePath)) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const error: any = new Error('Path is not a file');
        error.code = 'EISDIR';
        throw error;
      }
      return exists;
    } catch (e) {
      this.setError(e, { path: filePath });
    }
    return false;
  }

  public removeFile(filePath: string): boolean {
    try {
      if (!this.isFile(filePath)) {
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
    encoding: 'utf8' | 'base64' = 'utf8',
    recurse = false
  ): string[] | undefined {
    try {
      if (!this.isDirectory(directoryPath)) {
        return undefined;
      }

      const items = fs.readdirSync(directoryPath, { encoding });
      const files: string[] = [];

      for (const item of items) {
        const fullPath = path.join(directoryPath, item);
        if (this.isDirectory(fullPath)) {
          if (recurse) {
            files.push(...(this.getFiles(fullPath, encoding, true) || []));
          }
        } else if (this.isFile(fullPath)) {
          files.push(fullPath);
        } else {
          this.consoleAdapter.error('Path is not a file or directory', {
            path: fullPath,
          });
        }
      }

      return files;
    } catch (e) {
      this.setError(e, { path: directoryPath, encoding });
    }
    return [];
  }

  public async getFilesAsync(
    directoryPath: string,
    encoding: 'utf8' | 'base64' = 'utf8',
    recurse = false
  ): Promise<string[]> {
    try {
      const items = await fs.promises.readdir(directoryPath, { encoding });
      const files: string[] = [];

      for (const item of items) {
        const fullPath = path.join(directoryPath, item);
        if (this.isDirectory(fullPath)) {
          if (recurse) {
            files.push(...(await this.getFilesAsync(fullPath, encoding, true)));
          }
        } else if (this.isFile(fullPath)) {
          files.push(fullPath);
        } else {
          this.consoleAdapter.error('Path is not a file or directory', {
            path: fullPath,
          });
        }
      }

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
