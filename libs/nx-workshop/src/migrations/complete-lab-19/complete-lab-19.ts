import {
  addDependenciesToPackageJson,
  formatFiles,
  readJsonFile,
  readProjectConfiguration,
  Tree,
  updateJson,
  updateProjectConfiguration,
} from '@nrwl/devkit';
import { uniq } from '@nrwl/nx-plugin/testing';
import { execSync } from 'child_process';
import { replaceInFile } from '../utils';
import executorGenerator from '@nrwl/nx-plugin/src/generators/executor/executor';

export default async function update(host: Tree) {
  let herokuToken, herokuName;
  if (host.exists('.nx-workshop.json')) {
    const workshopConstants = readJsonFile('.nx-workshop.json');
    herokuToken = workshopConstants.herokuToken;
    herokuName = workshopConstants.surgeName;
  }
  if (!herokuToken || !herokuName) {
    const herokuToken = execSync('heroku authorizations:create')
      .toString()
      .split('\n')
      .filter((line) => line.startsWith('ID:'))
      .map((line) => line.replace('ID:', '').trim())[0];
    herokuName = uniq(`prophetic-narwhal-`);
    if (host.exists('.nx-workshop.json')) {
      updateJson(host, '.nx-workshop.json', (json) => {
        json.herokuToken = herokuToken;
        json.herokuName = herokuName;
        return json;
      });
    } else {
      host.write(
        '.nx-workshop.json',
        JSON.stringify({ herokuName, herokuToken })
      );
    }
  }

  execSync(`heroku create ${herokuName}`);

  host.write(
    'apps/api/.local.env',
    `
  HEROKU_API_KEY=${herokuToken}
  `
  );
  host.write(
    'apps/api/Dockerfile',
    `
    # use images supported by heroku
    FROM --platform=linux/amd64 node:14.17.0-alpine
    # switch to the /app folder in the image
    WORKDIR /app
    # copy all files from the folder its in into the /app folder we switched to
    COPY ./ ./
    # launch the main.js file
    CMD node main.js
`
  );

  await executorGenerator(host, {
    name: `heroku-deploy`,
    includeHasher: false,
    project: 'internal-plugin',
    unitTestRunner: 'jest',
  });

  host.write(
    'libs/internal-plugin/src/executors/heroku-deploy/schema.d.ts',
    `export interface HerokuDeployExecutorSchema {
    distLocation: string;
    herokuAppName: string;
  }
  `
  );

  host.write(
    'libs/internal-plugin/src/executors/heroku-deploy/schema.json',
    `{
    "$schema": "http://json-schema.org/schema",
    "cli": "nx",
    "title": "HerokuDeploy executor",
    "description": "",
    "type": "object",
    "properties": {
      "distLocation": {
        "type": "string"
      },
      "herokuAppName": {
        "type": "string"
      }
    },
    "required": ["distLocation", "herokuAppName"]
  }
  `
  );

  host.write(
    'libs/internal-plugin/src/executors/heroku-deploy/executor.ts',
    `import { HerokuDeployExecutorSchema } from './schema';
  import { execSync } from 'child_process';
  
  export default async function runExecutor(options: HerokuDeployExecutorSchema) {
    const cwd = options.distLocation;
    execSync(\`heroku container:login\`, { cwd });
    execSync(\`heroku container:push web --app \${options.herokuAppName}\`, { cwd });
    execSync(\`heroku container:release web --app \${options.herokuAppName}\`, {
      cwd,
    });
    return {
      success: true,
    };
  }
  `
  );

  const apiConfig = readProjectConfiguration(host, 'api');
  apiConfig.targets.build.configurations.production.externalDependencies = [
    '@nestjs/microservices',
    '@nestjs/microservices/microservices-module',
    '@nestjs/websockets/socket-module',
    'class-transformer',
    'class-validator',
    'cache-manager',
    'cache-manager/package.json',
  ];
  apiConfig.targets.build.configurations.production.assets = [
    'apps/api/src/assets',
    { glob: 'Dockerfile', input: 'apps/api', output: '.' },
  ];
  apiConfig.targets.deploy = {
    executor: '@bg-hoard/internal-plugin:heroku-deploy',
    outputs: [],
    options: {
      distLocation: 'dist/apps/api',
      herokuAppName: herokuName,
    },
    dependsOn: [{ target: 'build', projects: 'self', params: 'forward' }],
  };
  updateProjectConfiguration(host, 'api', apiConfig);

  addDependenciesToPackageJson(host, { cors: '*' }, {});
  replaceInFile(
    host,
    'apps/api/src/main.ts',
    `app.setGlobalPrefix(globalPrefix);
  const port = process.env.PORT || 3333;
`,
    `app.setGlobalPrefix(globalPrefix);
  app.enableCors();
  const port = process.env.PORT || 3333;
`
  );
  await formatFiles(host);
}
