import { RequestData } from 'mediatr-ts';
import { AnalyseJavascriptResponse } from './AnalyseJavascriptResponse';

export class AnalyseJavascriptRequest extends RequestData<AnalyseJavascriptResponse> {
  files: string[];

  constructor(files: string[]) {
    super();
    this.files = files;
  }
}
