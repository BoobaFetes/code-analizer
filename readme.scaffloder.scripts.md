# Scaffolder script with NX.DEV

```powershell
npx create-nx-workspace@latest --pm=yarn --name=src --preset=apps --nxCloud=skip
# at 01/08/2025, version is nx@20.3.1
set-location ./src

yarn nx add @nx/node
yarn nx g @nx/node:application@nx/node:application --directory=apps/cli --linter=eslint --name=cli --unitTestRunner=jest --tags=presenter --no-interactive


yarn nx @nx/js:library --directory=libs/code-analyser/application --bundler=esbuild --importPath=@code-analyser/application --linter=eslint --name=@code-analyser/application --publishable=true --unitTestRunner=jest --includeBabelRc=true --tags=application --useProjectJson=true --no-interactive

yarn nx @nx/js:library --directory=libs/code-analyser/infrastructure --bundler=esbuild --importPath=@code-analyser/infrastructure --linter=eslint --name=@code-analyser/infrastructure --publishable=true --unitTestRunner=jest --includeBabelRc=true --tags=infrastructure --useProjectJson=true --no-interactive

yarn nx @nx/js:library --directory=libs/code-analyser/domain --bundler=esbuild --importPath=@code-analyser/domain --linter=eslint --name=@code-analyser/domain --publishable=true --unitTestRunner=jest --includeBabelRc=true --tags=domain --useProjectJson=true --no-interactive
```
