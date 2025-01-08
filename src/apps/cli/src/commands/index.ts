import { Command } from 'commander';
import { run } from './run/run';

export function setCommands(command: Command): Command {
  run(command);
  return command;
}
