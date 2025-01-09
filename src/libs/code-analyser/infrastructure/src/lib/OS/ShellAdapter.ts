import { IShellAdapter } from '@code-analyser/appplication';
import { injectable } from 'inversify';

@injectable()
export class ShellAdapter implements IShellAdapter {
  getLocation(): string {
    throw new Error('Method not implemented.'); //return shell.pwd();
  }
  setLocation(location: string): void {
    throw new Error('Method not implemented.'); //shell.cd(location);
  }
  execute(command: string): void {
    throw new Error('Method not implemented.'); //shell.exec(command);
  }
  executeMany(commands: string[]): void {
    throw new Error('Method not implemented.');
    // commands.forEach((command) => {
    //   shell.exec(command);
    // });
  }
}
