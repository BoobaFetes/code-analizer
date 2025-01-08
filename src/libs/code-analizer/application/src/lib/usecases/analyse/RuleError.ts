import { BusinessError } from '../BusinessError';

export class RuleError extends BusinessError {
  constructor(code: string, message: string, sub?: Error[]) {
    super(code, message, sub);
    this.name = 'RuleError';
  }
}
