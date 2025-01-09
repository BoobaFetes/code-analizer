/* eslint-disable @typescript-eslint/no-explicit-any */

export interface IConsoleAdapter {
  log(message: any, ...optionalParams: any[]): void;
  error(message: any, ...optionalParams: any[]): void;
  warning(message: any, ...optionalParams: any[]): void;
  info(message: any, ...optionalParams: any[]): void;
  trace(message: any, ...optionalParams: any[]): void;
  debug(message: any, ...optionalParams: any[]): void;
  group(groupTitle?: string, ...optionalParams: any[]): void;
  groupEnd(): void;
  clear(): void;
}
