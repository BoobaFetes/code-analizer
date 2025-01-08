import { ResponseError } from '../ResponseError';
import { RuleError } from './RuleError';

export class AnalyzeErrors extends ResponseError {
  constructor(errors: RuleError[]) {
    super(errors);
  }

  public override addError(...errors: RuleError[]): void {
    super.addError(...errors);
  }
}
