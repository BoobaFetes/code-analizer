import { injectable } from 'inversify';
import { IFileSystemAdapter } from './adapters';

export interface IAsset {
  folder: { temp: string };
}

@injectable()
/** the Asset class is a constat throught the life cycle, so think to use the inversify container to get the ctor parameters */
export class Asset {
  public root: string;
  public temp: string;

  constructor(basePath: string, private fileSystemAdapter: IFileSystemAdapter) {
    if (!fileSystemAdapter.isDirectory(basePath)) {
      throw new Error(`basePath is not a directory : '${basePath}'`);
    }
    if (!this.fileSystemAdapter.directoryExists(basePath)) {
      throw new Error(`basePath not found : '${basePath}'`);
    }
    this.root = `${basePath}\\assets`;
    this.temp = `${this.root}\\temp`;

    [this.root, this.temp].forEach((path) => {
      if (!this.fileSystemAdapter.directoryExists(path)) {
        this.fileSystemAdapter.createDirectory(path);
      }
    });
  }

  public clearTempDirectory() {
    this.fileSystemAdapter.removeDirectory(this.temp, true);
    this.fileSystemAdapter.createDirectory(this.temp);
  }
}
