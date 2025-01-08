import { Mediator } from 'mediatr-ts';
import { InversifyResolver } from './inversify';

export const mediator = new Mediator({
  resolver: new InversifyResolver(),
});
