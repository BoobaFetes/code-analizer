import {
  AnalyseJavascriptRequest,
  IFileSystemAdapter,
  IShellAdapter,
  mediator,
  TYPES,
} from '@code-analizer/application';
import { Command } from 'commander';
import { inject } from 'inversify';
import path from 'path';
import { asset } from '../assets';

interface IJavascriptOptions {
  git?: string;
  directory?: string;
  file?: string;
}

export class JavascriptCommand {
  constructor(
    command: Command,
    @inject(TYPES.IShellAdapter) shellAdapter?: IShellAdapter,
    @inject(TYPES.IFileSystemAdapter) fileSystemAdapter?: IFileSystemAdapter
  ) {
    const javascriptCommand = command
      .command('javascript')
      .description('Start code analizer for javascript')
      .option('-g, --git <path>', 'url of the git repository')
      .option('-d, --directory <path>', 'Path to the directory')
      .option('-f, --file <path>', 'Path to the file');

    javascriptCommand.action(
      async ({ directory, file, git }: IJavascriptOptions) => {
        const files: string[] = [];
        if (git) {
          // arrange
          const { folder } = asset;
          const cloneDirectory = path.join(
            folder.git,
            path.basename(git, '.git')
          );

          // action : set location
          shellAdapter.setLocation(folder.git);

          // action : clone repository
          shellAdapter.execute(`git clone ${git}`);

          // action : fill files from clone directory
          files.push(...fileSystemAdapter.getFiles(cloneDirectory));
        }
        if (directory) {
          files.push(...fileSystemAdapter.getFiles(directory));
        }
        if (file) {
          files.push(file);
        }

        const response = await mediator.send(
          new AnalyseJavascriptRequest(files)
        );

        console.log(response.status);

        console.log('errors');
        if (!response.errors.length) {
          console.log('- no matches');
        } else {
          response.errors.forEach((error) => {
            console.log(`- ${error.code}: ${error.message}`);
          });
        }

        console.log('files');
        response.files.forEach((file) => {
          console.log(`- ${file}`);
        });
      }
    );
  }
}
