export interface IViolation {
  ruleId: string;
  ruleDescription: string;
  lineNumber: number;
  columnNumber: number;
  severity: string;
  url: string;
}

export function newViolation(obj?: Partial<IViolation>): IViolation {
  return {
    ruleId: obj?.ruleId || 'ruleId',
    ruleDescription: obj?.ruleDescription || 'ruleDescription',
    lineNumber: obj?.lineNumber || 0,
    columnNumber: obj?.columnNumber || 0,
    severity: obj?.severity || 'severity',
    url: 'url',
    ...obj,
  };
}
