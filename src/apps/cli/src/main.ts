import 'dotenv/config';

import { resolveApplicationDependencies } from '@code-analyser/appplication';
import { resolveInfrastructureDependencies } from '@code-analyser/infrastructure';
import { Command } from 'commander';
import { Container } from 'inversify';
import { RunCommand } from './commands';
import { PresenterTypes, resolvePresenterDependencies } from './dependencies';

const container = new Container();
resolveInfrastructureDependencies(container);
resolveApplicationDependencies(container);
resolvePresenterDependencies(container);

const program = new Command();

program
  .version('0.0.1')
  .description('An example CLI for demonstration purposes')
  .option('-d, --debug', 'output extra debugging')
  .option('-p, --port <number>', 'port number', '3000');

container.get<RunCommand>(PresenterTypes.RunCommand).build(program);

program.parse(process.argv);

const options = program.opts();
if (options.debug) console.log(options);
