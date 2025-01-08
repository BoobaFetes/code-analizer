import { Class, Resolver } from 'mediatr-ts';
import { container } from './container';

export class InversifyResolver implements Resolver {
  resolve<T>(type: Class<T>): T {
    return container.get(type);
  }

  add<T>(type: Class<T>): void {
    container.bind(type).toSelf();
  }
}
