import { inject, injectable } from 'inversify';
import { requestHandler, RequestHandler } from 'mediatr-ts';
import {
  IConsoleAdapter,
  IFileSystemAdapter,
  IShellAdapter,
} from '../../../adapters';
import { Asset } from '../../../Asset';
import { ApplicationTypes } from '../../../dependencies';
import { AnalyseError, AnalyserResponseFile } from '../AnalyserResponseFile';
import { JavascriptAnalyserRequest } from './JavascriptAnalyserRequest';
import { JavascriptAnalyserResponse } from './JavascriptAnalyserResponse';
import path = require('path');

interface IExtractPathRef {
  paths: string[];
}

@requestHandler(JavascriptAnalyserRequest)
@injectable()
export class JavascriptAnalyserHandler
  implements
    RequestHandler<JavascriptAnalyserRequest, JavascriptAnalyserResponse>
{
  @inject(ApplicationTypes.Asset)
  private asset!: Asset;
  @inject(ApplicationTypes.ShellAdapter)
  private shellAdapter!: IShellAdapter;
  @inject(ApplicationTypes.FileSystemAdapter)
  private fileSystemAdapter!: IFileSystemAdapter;
  @inject(ApplicationTypes.ConsoleAdapter)
  private consoleAdapter!: IConsoleAdapter;

  async handle({
    paths,
  }: JavascriptAnalyserRequest): Promise<JavascriptAnalyserResponse> {
    // arrange
    const response = new JavascriptAnalyserResponse();
    const ref: IExtractPathRef = { paths };
    const validPaths: string[] = [];

    // extract valid paths

    this.extractGitFolders(ref).forEach((git) => {
      // arrange
      const cloneDirectory = path.join(
        this.asset.temp,
        path.basename(git, '.git')
      );

      // action : set location
      this.shellAdapter.setLocation(this.asset.temp);

      // action : clone repository
      this.consoleAdapter.log(`cloning ${git}`);
      this.shellAdapter.execute(`git clone ${git}`);

      // action : fill files from clone directory
      validPaths.push(...this.fileSystemAdapter.getFiles(cloneDirectory));
    });

    validPaths.push(...this.extractFolders(ref), ...this.extractFiles(ref));

    ref.paths.forEach((path) => {
      response.add(
        new AnalyserResponseFile(path, [
          new AnalyseError('ENOTDIR', 'unexepcted path'),
        ])
      );
    });

    this.executeAnalysis(response, validPaths);

    return Promise.resolve<JavascriptAnalyserResponse>(response);
  }

  private executeAnalysis(
    response: JavascriptAnalyserResponse,
    paths: string[]
  ) {
    console.log(
      'JavascriptAnalyserHandler.executeAnalysis : Method not implemented.',
      { response, paths }
    );
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
