import { inject, injectable } from 'inversify';
import { requestHandler, RequestHandler } from 'mediatr-ts';
import { IConsoleAdapter, IFileSystemAdapter } from '../../../adapters';
import { Asset } from '../../../Asset';
import { ApplicationTypes } from '../../../dependencies';
import { IExtractPathRef, ValidPathExtractor } from '../../../extractors';
import { JavascriptAnalyserRequest } from './JavascriptAnalyserRequest';
import { JavascriptAnalyserResponse } from './JavascriptAnalyserResponse';

@requestHandler(JavascriptAnalyserRequest)
@injectable()
export class JavascriptAnalyserHandler
  implements
    RequestHandler<JavascriptAnalyserRequest, JavascriptAnalyserResponse>
{
  @inject(ApplicationTypes.Asset)
  private asset!: Asset;
  @inject(ApplicationTypes.FileSystemAdapter)
  private fileSystemAdapter!: IFileSystemAdapter;
  @inject(ApplicationTypes.ConsoleAdapter)
  private consoleAdapter!: IConsoleAdapter;
  @inject(ApplicationTypes.ValidPathExtractor)
  private validFileExtractor!: ValidPathExtractor;

  async handle({
    paths,
  }: JavascriptAnalyserRequest): Promise<JavascriptAnalyserResponse> {
    // arrange
    const response = new JavascriptAnalyserResponse();
    const ref: IExtractPathRef = { paths, errors: [] };

    // extract valid paths
    const validPaths = this.validFileExtractor.execute(ref);
    response.add(...ref.errors);

    // analyse the folders and files
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
}
