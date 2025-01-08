import { domain } from '@code-analizer/domain';
import { infrastructure } from '@code-analizer/infrastructure';

export function application(): string {
  return `application : ${infrastructure()} : ${domain()}`;
}
