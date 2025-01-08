export class BusinessError extends Error {
  public code: string;
  public sub?: Error[];

  constructor(code: string, message: string, sub?: Error[]) {
    super(message);
    this.name = 'BusinessError';

    this.code = code;
    this.sub = sub;
  }
}
