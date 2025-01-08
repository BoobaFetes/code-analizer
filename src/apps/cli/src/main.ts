import {
  IConsoleAdapter,
  IFileSystemAdapter,
  IShellAdapter,
  resolveDependencyInjection,
  TYPES,
} from '@code-analizer/application';
import {
  ConsoleAdapter,
  FileSystemAdapter,
  ShellAdapter,
} from '@code-analizer/infrastructure';
import { Command } from 'commander';
import dotenv from 'dotenv';
import { setCommands } from './commands';

// arrange
resolveDependencyInjection((container) => {
  container.bind<IConsoleAdapter>(TYPES.IConsoleAdapter).to(ConsoleAdapter);
  container
    .bind<IFileSystemAdapter>(TYPES.IFileSystemAdapter)
    .to(FileSystemAdapter);
  container.bind<IShellAdapter>(TYPES.IShellAdapter).to(ShellAdapter);
});
dotenv.config();

// act
try {
  const cli = new Command();
  cli.name('code-analizer').version('0.0.1').description('Code analizer CLI');
  setCommands(cli);
  cli.parse(process.argv);
} catch (e) {
  console.error(e);
}
