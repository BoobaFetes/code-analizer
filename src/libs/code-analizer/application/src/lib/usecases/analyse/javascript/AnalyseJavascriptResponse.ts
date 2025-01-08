import { ResponseError } from '../../ResponseError';

type StatusType = 'success' | 'unresolved' | 'error';

export class AnalyseJavascriptResponse extends ResponseError {
  status: StatusType;
  files: string[];

  constructor(status: StatusType, files: string[]) {
    super();
    this.status = status;
    this.files = files;
  }
}
