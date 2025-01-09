import { Container } from 'inversify';
import { Mediator } from 'mediatr-ts';
import { InversifyDependencyResolver } from './InversifyDependencyResolver';

export let mediator: Mediator;

export function configureMediatr(container: Container) {
  mediator = new Mediator({
    resolver: new InversifyDependencyResolver(container),
  });
}
