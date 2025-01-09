import { AnalyseError, AnalyserResponseFile } from '@code-analyser/domain';
import { inject, injectable } from 'inversify';
import * as nodePath from 'path';
import { IFileSystemAdapter } from '../adapters';
import { ApplicationTypes } from '../dependencies';

export interface IExtractPathRef {
  paths: string[];
  errors: AnalyserResponseFile[];
}

type PathValidatorFn = (path: string) => boolean;

@injectable()
export class PathSelector {
  @inject(ApplicationTypes.FileSystemAdapter)
  private fileSystemAdapter!: IFileSystemAdapter;

  public execute(
    ref: IExtractPathRef,
    excludes: { directory: PathValidatorFn[]; files: PathValidatorFn[] }
  ): string[] {
    ref.errors = [];

    // TODO : optimmiser la recherche des fichiers
    // pour 16000 fichiers cela prend 2s environs

    // we looking for all files from the paths
    ref.paths = ref.paths
      .map((path) => {
        const subs = this.fileSystemAdapter.getFiles(path, undefined, true);
        return subs === undefined ? [path] : subs;
      })
      .flat();

    const validPaths = [
      ...this.extractFolders(ref, excludes.directory),
      ...this.extractFiles(ref, excludes.files),
    ];

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
    return this.extractPaths(ref, [], (path) => path.endsWith('.git'));
  }

  private extractFolders(
    ref: IExtractPathRef,
    excludes: PathValidatorFn[] = []
  ): string[] {
    return this.extractPaths(ref, excludes, (path) => {
      return (
        !nodePath.basename(path).startsWith('.') &&
        this.fileSystemAdapter.isDirectory(path) &&
        this.fileSystemAdapter.directoryExists(path)
      );
    });
  }

  private extractFiles(
    ref: IExtractPathRef,
    excludes: PathValidatorFn[] = []
  ): string[] {
    return this.extractPaths(
      ref,
      excludes,
      (path) =>
        this.fileSystemAdapter.isFile(path) &&
        this.fileSystemAdapter.fileExists(path)
    );
  }

  private extractPaths(
    ref: IExtractPathRef,
    excludes: PathValidatorFn[],
    checkFn: (path: string) => boolean
  ): string[] {
    const paths = ref.paths;
    ref.paths = [];
    return paths.reduce((acc: string[], currentPath: string) => {
      if (checkFn(currentPath)) {
        // the target pass the check so it will be abandoned if it is in the excludes list
        if (excludes.every((fn) => fn(currentPath))) {
          acc.push(currentPath);
        }
      } else {
        ref.paths.push(currentPath);
      }
      return acc;
    }, []);
  }
}
