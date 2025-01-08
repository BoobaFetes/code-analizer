import { RequestHandler, requestHandler } from 'mediatr-ts';
import { BusinessError } from '../../BusinessError';
import { AnalyseJavascriptRequest } from './AnalyseJavascriptRequest';
import { AnalyseJavascriptResponse } from './AnalyseJavascriptResponse';

@requestHandler(AnalyseJavascriptRequest)
export class AnalyseJavascriptHandler
  implements
    RequestHandler<AnalyseJavascriptRequest, AnalyseJavascriptResponse>
{
  async handle(
    request: AnalyseJavascriptRequest
  ): Promise<AnalyseJavascriptResponse> {
    let response: AnalyseJavascriptResponse;
    try {
      console.log('request is working');
      console.log('args', request);

      response = new AnalyseJavascriptResponse('success', request.files);
      return await Promise.resolve(response);
    } catch (e) {
      response = new AnalyseJavascriptResponse('error', request.files);
      if (e instanceof BusinessError) {
        response.addError(e);
      } else if (e instanceof Error) {
        response.addError(
          new BusinessError(
            'UNEXPECTED_ERROR',
            'An unexpected error occurred',
            [e]
          )
        );
      } else {
        response = new AnalyseJavascriptResponse('unresolved', request.files);
      }

      return Promise.reject(response.errors);
    }
  }
}
