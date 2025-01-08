/* eslint-disable @typescript-eslint/no-explicit-any */

import { IConsoleAdapter } from '@code-analizer/application';
import { injectable } from 'inversify';

@injectable()
export class ConsoleAdapter implements IConsoleAdapter {
  log(message: any, ...optionalParams: any[]): void {
    console.log(message, ...optionalParams);
  }
  error(message: any, ...optionalParams: any[]): void {
    console.error(message, ...optionalParams);
  }
  warning(message: any, ...optionalParams: any[]): void {
    console.warn(message, ...optionalParams);
  }
  info(message: any, ...optionalParams: any[]): void {
    console.info(message, ...optionalParams);
  }
  trace(message: any, ...optionalParams: any[]): void {
    console.trace(message, ...optionalParams);
  }
  debug(message: any, ...optionalParams: any[]): void {
    console.debug(message, ...optionalParams);
  }
  group(groupTitle?: string, ...optionalParams: any[]): void {
    console.group(groupTitle, ...optionalParams);
  }
  groupEnd(): void {
    console.groupEnd();
  }
  clear(): void {
    console.clear();
  }
}
