import { Command } from 'commander';

export interface ICommand {
  build(parent: Command): void;
}
