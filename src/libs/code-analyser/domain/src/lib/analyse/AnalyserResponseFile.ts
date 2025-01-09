import { AnalyseError } from './AnalyseError';
import { AnalyseViolationError } from './AnalyseViolationError';

export class AnalyserResponseFile {
  public readonly file: string;
  public readonly errors: AnalyseError[];

  constructor(file: string, errors: AnalyseError[] = []) {
    this.file = file;
    this.errors = errors;
  }

  public addError(...errors: AnalyseError[]): void {
    this.errors.push(...errors);
  }

  public addViolation(...violations: AnalyseViolationError[]): void {
    this.errors.push(...violations);
  }

  public clearErrors(): void {
    this.errors.splice(0);
  }
}
