import { AnalyseError, AnalyserResponseFile } from '@code-analyser/domain';

export class JavascriptAnalyserResponse {
  public readonly files: AnalyserResponseFile[];

  public get status(): 'success' | 'error' {
    return this.files.every((file) => !file.errors.length)
      ? 'success'
      : 'error';
  }

  public get errors(): AnalyseError[] {
    return this.files.reduce<AnalyseError[]>(
      (acc, file) => [...acc, ...file.errors],
      []
    );
  }

  constructor(files: AnalyserResponseFile[] = []) {
    this.files = files;
  }

  public add(...files: AnalyserResponseFile[]): void {
    this.files.push(...files);
  }
}
