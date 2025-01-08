import { Command } from 'commander';
import { JavascriptCommand } from './Javascript';

export function run(command: Command): void {
  const runCommand = command.command('run').description('Start code analizer');
  new JavascriptCommand(runCommand);
}
