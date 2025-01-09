import { ApplicationTypes } from '@code-analyser/appplication';
import { Container } from 'inversify';
import { ConsoleAdapter, FileSystemAdapter, ShellAdapter } from '../OS';

export function resolveInfrastructureDependencies(container: Container) {
  console.log('Resolving infrastructure dependencies');
  container.bind(ApplicationTypes.ConsoleAdapter).to(ConsoleAdapter);
  container.bind(ApplicationTypes.FileSystemAdapter).to(FileSystemAdapter);
  container.bind(ApplicationTypes.ShellAdapter).to(ShellAdapter);
}
