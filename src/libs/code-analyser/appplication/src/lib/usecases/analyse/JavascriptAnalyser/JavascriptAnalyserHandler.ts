import * as babel from '@babel/core';
import * as babelTypes from '@babel/types';
import {
  AnalyseError,
  AnalyserResponseFile,
  AnalyseViolationError,
  newViolation,
} from '@code-analyser/domain';
import { inject, injectable } from 'inversify';
import { requestHandler, RequestHandler } from 'mediatr-ts';
import { IFileSystemAdapter } from '../../../adapters';
import { ApplicationTypes } from '../../../dependencies';
import { IExtractPathRef, PathSelector } from '../../../extractors';
import { JavascriptAnalyserRequest } from './JavascriptAnalyserRequest';
import { JavascriptAnalyserResponse } from './JavascriptAnalyserResponse';

@requestHandler(JavascriptAnalyserRequest)
@injectable()
export class JavascriptAnalyserHandler
  implements
    RequestHandler<JavascriptAnalyserRequest, JavascriptAnalyserResponse>
{
  @inject(ApplicationTypes.FileSystemAdapter)
  private fileSystemAdapter!: IFileSystemAdapter;
  @inject(ApplicationTypes.PathSelector)
  private pathSelector!: PathSelector;

  async handle({
    paths,
  }: JavascriptAnalyserRequest): Promise<JavascriptAnalyserResponse> {
    // arrange
    const response = new JavascriptAnalyserResponse();
    const ref: IExtractPathRef = { paths, errors: [] };

    console.log('extracts files');
    // extract valid paths
    const validPaths = this.pathSelector.execute(ref, {
      directory: [
        (path) => {
          return !path.includes('node_modules');
        },
      ],
      files: [
        (path) => {
          return !path.includes('node_modules');
        },
        (path) => {
          return path.endsWith('.js');
        },
      ],
    });
    response.add(...ref.errors);

    // analyse the folders and files
    console.log('analysing javascript/typecript');
    await this.executeAnalysis(response, validPaths);

    return response;
  }

  private async executeAnalysis(
    response: JavascriptAnalyserResponse,
    paths: string[]
  ) {
    // pas de parrallelisme pour le moment cela va compliquer le code !!
    // idées pour le parallélisme:
    // - worker_threads (node js > 10.5)
    // - cluster (node js > 0.8)
    // - async.js
    // - bluebird
    for (const path of paths) {
      const current = new AnalyserResponseFile(path);
      response.add(current);

      const content = await this.fileSystemAdapter.readFileAsync(path);
      if (!content) {
        current.addError(
          new AnalyseError('emtpy_file', 'the content of a file is required')
        );
        continue;
      }

      const ast = await babel.parseAsync(content);
      if (!ast) {
        current.addError(
          new AnalyseError('invalid_content', 'the code is invalid')
        );
        continue;
      }

      // Parcourir l'AST (exemple simplifié)
      try {
        babel.traverse(ast, {
          CallExpression(path) {
            const callee = path.node.callee;

            // Vérifier si l'appel de fonction est `res.status()`
            if (
              babelTypes.isMemberExpression(callee) &&
              babelTypes.isIdentifier(callee.object, { name: 'res' }) &&
              babelTypes.isIdentifier(callee.property, { name: 'status' })
            ) {
              const statusCode = path.node.arguments[0];

              // Vérifier si le code de statut est un entier
              if (babelTypes.isNumericLiteral(statusCode)) {
                // TODO: Vérifier si le code de statut est valide en fonction de la méthode HTTP
                // ...

                // Exemple de violation (à adapter)
                current.addViolation(
                  new AnalyseViolationError(
                    newViolation({
                      ruleId: 'REST-001',
                      ruleDescription: 'Code de retour incorrect',
                      lineNumber: path.node.loc?.start.line || 0,
                      columnNumber: path.node.loc?.start.column || 0,
                      severity: 'error',
                      // method: 'GET', // TODO: Déterminer la méthode HTTP
                      // expectedCode: '200 OK', // TODO: Déterminer le code attendu
                      // actualCode: statusCode.value.toString(),
                      url: 'https://example.com/rest-best-practices',
                    })
                  )
                );
              }
            }
          },
        });
      } catch (e) {
        current.addError(
          new AnalyseError('traverse_error', 'error while traversing')
        );
      }
    }
  }
}
