export class AnalyseError extends Error {
  constructor(public readonly code: string, message: string) {
    super(message);
    this.name = 'AnalyseError';
  }
}

export class AnalyserResponseFile {
  public readonly file: string;
  public readonly errors: AnalyseError[];

  constructor(file: string, errors: AnalyseError[] = []) {
    this.file = file;
    this.errors = errors;
  }

  public addErrors(...errors: AnalyseError[]): void {
    this.errors.push(...errors);
  }
  public addError(error: AnalyseError): void {
    this.errors.push(error);
  }
  public clearErrors(): void {
    this.errors.splice(0);
  }
}
