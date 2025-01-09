import { Container } from 'inversify';
import { Asset } from '../Asset';
import { ValidPathExtractor } from '../extractors';
import { ApplicationTypes } from './ApplicationTypes';
import { configureMediatr } from './mediatr.config';

export function resolveApplicationDependencies(container: Container) {
  console.log('Resolving application dependencies');
  configureMediatr(container);
  container.bind(ApplicationTypes.ValidPathExtractor).to(ValidPathExtractor);
  container.bind(ApplicationTypes.Asset).toDynamicValue(({ container }) => {
    const devPath =
      (process.env['NODE_ENV'] !== 'production' && '\\dist\\apps\\cli') || '';
    return new Asset(
      `${process.cwd()}${devPath}`,
      container.get(ApplicationTypes.FileSystemAdapter)
    );
  });
}
