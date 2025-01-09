import { Command } from 'commander';
import { inject, injectable } from 'inversify';
import { PresenterTypes } from '../../dependencies/PresenterTypes';
import { ICommand } from '../ICommand';
import { RunJavascriptCommand } from './RunJavascriptCommand';

@injectable()
export class RunCommand implements ICommand {
  @inject(PresenterTypes.RunJavascriptCommand)
  javascriptCommand: RunJavascriptCommand;

  public build(parent: Command): void {
    const command = parent.command('run').description('Start code analizer');

    this.javascriptCommand.build(command);
  }
}
