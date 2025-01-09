import { ApplicationTypes } from '@code-analyser/appplication';
import { Container } from 'inversify';
import { ConsoleAdapter, FileSystemAdapter } from '../OS';

export function resolveInfrastructureDependencies(container: Container) {
  console.log('Resolving infrastructure dependencies');
  container.bind(ApplicationTypes.ConsoleAdapter).to(ConsoleAdapter);
  container.bind(ApplicationTypes.FileSystemAdapter).to(FileSystemAdapter);
}
