import { AnalyseError, AnalyserResponseFile } from '@code-analyser/domain';

export class JavascriptAnalyserResponse {
  public readonly responses: AnalyserResponseFile[];

  public get status(): 'success' | 'error' {
    return this.responses.every((file) => !file.errors.length)
      ? 'success'
      : 'error';
  }

  public get errors(): AnalyseError[] {
    return this.responses.reduce<AnalyseError[]>(
      (acc, file) => [...acc, ...file.errors],
      []
    );
  }

  constructor(files: AnalyserResponseFile[] = []) {
    this.responses = files;
  }

  public add(...files: AnalyserResponseFile[]): void {
    this.responses.push(...files);
  }
}
