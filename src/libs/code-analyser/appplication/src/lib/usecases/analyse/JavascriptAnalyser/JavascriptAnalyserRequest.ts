import { RequestData } from 'mediatr-ts';
import { JavascriptAnalyserResponse } from './JavascriptAnalyserResponse';

export class JavascriptAnalyserRequest extends RequestData<JavascriptAnalyserResponse> {
  public readonly paths: string[];

  constructor(paths: string[]) {
    super();
    this.paths = paths;
  }
}
