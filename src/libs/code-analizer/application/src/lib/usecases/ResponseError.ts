import { BusinessError } from './BusinessError';

export class ResponseError {
  protected _errors: BusinessError[];
  public get errors(): ReadonlyArray<BusinessError> {
    return this._errors;
  }

  constructor(errors?: BusinessError[]) {
    this._errors = errors || [];
  }

  public clearErrors(): void {
    this._errors.splice(0);
  }

  public addError(...errors: BusinessError[]): void {
    this._errors.push(...errors);
  }
}
