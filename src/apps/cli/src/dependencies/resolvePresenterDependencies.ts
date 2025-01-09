import { Container } from 'inversify';
import { RunCommand, RunJavascriptCommand } from '../commands';
import { PresenterTypes } from './PresenterTypes';

export function resolvePresenterDependencies(container: Container) {
  console.log('Resolving presenter dependencies');
  container.bind(PresenterTypes.RunCommand).to(RunCommand);
  container.bind(PresenterTypes.RunJavascriptCommand).to(RunJavascriptCommand);
}
