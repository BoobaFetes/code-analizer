import { Command } from 'commander';
import { inject, injectable } from 'inversify';
//import { asset } from '../assets';
import {
  ApplicationTypes,
  IConsoleAdapter,
  JavascriptAnalyserRequest,
  mediator,
} from '@code-analyser/appplication';
import { ICommand } from '../ICommand';

@injectable()
export class RunJavascriptCommand implements ICommand {
  @inject(ApplicationTypes.ConsoleAdapter)
  private consoleAdapter: IConsoleAdapter;

  public build(parent: Command): void {
    const command = parent
      .command('js')
      .description('Start code analizer for javascript')
      .argument('[paths...]', 'paths to analyse');

    command.action(async (paths: string[] = []) => {
      const response = await mediator.send(
        new JavascriptAnalyserRequest(paths)
      );

      this.consoleAdapter.log(response.status);

      this.consoleAdapter.log('errors');
      if (!response.errors.length) {
        this.consoleAdapter.log('- no matches');
      } else {
        response.errors.forEach((error) => {
          this.consoleAdapter.log(`- ${error.code}: ${error.message}`);
        });
      }

      this.consoleAdapter.log('files');
      if (!response.errors.length) {
        this.consoleAdapter.log('- no files');
      } else {
        response.files.forEach((file) => {
          this.consoleAdapter.log(`- ${file}`);
        });
      }
    });
  }
}