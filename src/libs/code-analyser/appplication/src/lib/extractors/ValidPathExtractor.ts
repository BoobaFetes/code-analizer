import { AnalyseError, AnalyserResponseFile } from '@code-analyser/domain';
import { inject, injectable } from 'inversify';
import { IFileSystemAdapter } from '../adapters';
import { ApplicationTypes } from '../dependencies';

export interface IExtractPathRef {
  paths: string[];
  errors: AnalyserResponseFile[];
}

export function extractValidFiles(
  path: string[],
  ref: IExtractPathRef
): string[] {
  return path.filter((path) => {
    if (ref.paths.includes(path)) {
      return true;
    }
    ref.paths.push(path);
    return false;
  });
}

@injectable()
export class ValidPathExtractor {
  @inject(ApplicationTypes.FileSystemAdapter)
  private fileSystemAdapter!: IFileSystemAdapter;

  public execute(ref: IExtractPathRef): string[] {
    ref.errors = [];

    const validPaths = [...this.extractFolders(ref), ...this.extractFiles(ref)];

    // create error for git repository paths
    ref.errors.push(
      ...this.extractGitFolders(ref).map(
        (path) =>
          new AnalyserResponseFile(path, [
            new AnalyseError(
              'ENOTDIR',
              'git repository are not allowed, clone it first by yourself'
            ),
          ])
      ),
      ...ref.paths.map(
        (path) =>
          new AnalyserResponseFile(path, [
            new AnalyseError('ENOTDIR', 'unexepcted path'),
          ])
      )
    );

    return validPaths;
  }

  private extractGitFolders(ref: IExtractPathRef): string[] {
    return this.extractPaths(ref, (path) => path.endsWith('.git'));
  }

  private extractFolders(ref: IExtractPathRef): string[] {
    return this.extractPaths(ref, (path) =>
      this.fileSystemAdapter.isDirectory(path)
    );
  }

  private extractFiles(ref: IExtractPathRef): string[] {
    return this.extractPaths(ref, (path) =>
      this.fileSystemAdapter.isFile(path)
    );
  }
  private extractPaths(
    ref: IExtractPathRef,
    checkFn: (path: string) => boolean
  ): string[] {
    const paths = ref.paths;
    ref.paths = [];
    return paths.reduce((acc: string[], currentPath: string) => {
      if (checkFn(currentPath)) {
        acc.push(currentPath);
      } else {
        ref.paths.push(currentPath);
      }
      return acc;
    }, []);
  }
}
