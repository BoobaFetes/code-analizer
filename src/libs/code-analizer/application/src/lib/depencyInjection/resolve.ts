import { Container } from 'inversify';
import { container } from './inversify';

/** has to be the first instruction of the application */
export function resolveDependencyInjection(
  callback: (container: Container) => void
) {
  callback(container);
}
