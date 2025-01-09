import { Container } from 'inversify';
import { PathSelector } from '../extractors';
import { ApplicationTypes } from './ApplicationTypes';
import { configureMediatr } from './mediatr.config';

export function resolveApplicationDependencies(container: Container) {
  console.log('Resolving application dependencies');
  configureMediatr(container);
  container.bind(ApplicationTypes.PathSelector).to(PathSelector);
}
