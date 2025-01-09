import { AnalyseError } from './AnalyseError';
import { IViolation } from './Violation';

export class AnalyseViolationError extends AnalyseError {
  public readonly violation: IViolation;

  constructor(violation: IViolation) {
    super(violation.ruleId, 'bad practice detected');
    this.name = 'AnalyseViolationError';
    this.violation = violation;
  }
}
