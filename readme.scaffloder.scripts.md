# Scaffolder script with NX.DEV

```powershell
npx create-nx-workspace@latest --pm=yarn --name=src --preset=apps --nxCloud=skip
# at 01/08/2025, version is nx@20.3.1
set-location ./src

yarn nx add @nx/node
yarn nx g @nx/node:application apps/cli --name=cli --bundler=webpack --framework=none --tags=presenter --linter=eslint --unitTestRunner=jest --e2eTestRunner=none

yarn nx generate @nx/js:library --useProjectJson=true --publishable=true --bundler=rollup --linter=eslint --unitTestRunner=jest --directory=libs/code-analizer/application --name=@code-analizer/application --importPath=@code-analizer/application --tags=application
yarn nx generate @nx/js:library --useProjectJson=true --publishable=true --bundler=rollup --linter=eslint --unitTestRunner=jest --directory=libs/code-analizer/domain --name=@code-analizer/domain --importPath=@code-analizer/domain --tags=domain
yarn nx generate @nx/js:library --useProjectJson=true --publishable=true --bundler=rollup --linter=eslint --unitTestRunner=jest --directory=libs/code-analizer/infrastructure --name=@code-analizer/infrastructure --importPath=@code-analizer/infrastructure --tags=infrastructure

```
