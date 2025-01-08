import { IShellAdapter } from '@code-analizer/application';
import { injectable } from 'inversify';
import * as shell from 'shelljs';

@injectable()
export class ShellAdapter implements IShellAdapter {
  getLocation(): string {
    return shell.pwd();
  }
  setLocation(location: string): void {
    shell.cd(location);
  }
  execute(command: string): void {
    shell.exec(command);
  }
  executeMany(commands: string[]): void {
    commands.forEach((command) => {
      shell.exec(command);
    });
  }
}
