import {
  addDependenciesToPackageJson,
  formatFiles,
  readJsonFile,
  readProjectConfiguration,
  Tree,
  updateJson,
  updateProjectConfiguration,
} from '@nx/devkit';
import { uniq } from '@nx/plugin/testing';
import { execSync } from 'child_process';
import { replaceInFile } from '../utils';
import executorGenerator from '@nx/plugin/src/generators/executor/executor';

export default async function update(host: Tree) {
  let flyToken, flyName;
  if (host.exists('.nx-workshop.json')) {
    const workshopConstants = readJsonFile('.nx-workshop.json');
    flyToken = workshopConstants.flyToken;
    flyName = workshopConstants.flyName;
  }
  if (!flyToken || !flyName) {
    flyToken = execSync('fly auth token')
      .toString()
      .split('\n')
      .map((line) => line.trim())[0];
    flyName = uniq(`prophetic-narwhal-`);
    if (host.exists('.nx-workshop.json')) {
      updateJson(host, '.nx-workshop.json', (json) => {
        json.flyToken = flyToken;
        json.flyName = flyName;
        return json;
      });
    } else {
      host.write('.nx-workshop.json', JSON.stringify({ flyName, flyToken }));
    }
  }

  host.write(
    'apps/api/.local.env',
    `FLY_API_TOKEN=${flyToken}
  `
  );
  host.write(
    'apps/api/src/fly.toml',
    `
app = "${flyName}"
kill_signal = "SIGINT"
kill_timeout = 5
processes = []

[build]
  builder = "paketobuildpacks/builder:base"
  buildpacks = ["gcr.io/paketo-buildpacks/nodejs"]

[env]
  PORT = "8080"

[experimental]
  cmd = ["PORT=8080 node main.js"]

[[services]]
  http_checks = []
  internal_port = 8080
  processes = ["app"]
  protocol = "tcp"
  script_checks = []
  [services.concurrency]
    hard_limit = 25
    soft_limit = 20
    type = "connections"

  [[services.ports]]
    force_https = true
    handlers = ["http"]
    port = 80

  [[services.ports]]
    handlers = ["tls", "http"]
    port = 443

  [[services.tcp_checks]]
    grace_period = "1s"
    interval = "15s"
    restart_limit = 0
    timeout = "2s"
`
  );

  await executorGenerator(host, {
    name: `fly-deploy`,
    includeHasher: false,
    project: 'internal-plugin',
    unitTestRunner: 'jest',
  });

  host.write(
    'libs/internal-plugin/src/executors/fly-deploy/schema.d.ts',
    `export interface FlyDeployExecutorSchema {
  distLocation: string;
  flyAppName: string;
}
  `
  );

  host.write(
    'libs/internal-plugin/src/executors/fly-deploy/schema.json',
    `{
  "$schema": "http://json-schema.org/schema",
  "cli": "nx",
  "title": "FlyDeploy executor",
  "description": "",
  "type": "object",
  "properties": {
    "distLocation": {
      "type": "string"
    },
    "flyAppName": {
      "type": "string"
    }
  },
  "required": ["distLocation", "flyAppName"]
}
  `
  );

  host.write(
    'libs/internal-plugin/src/executors/fly-deploy/executor.ts',
    `import { FlyDeployExecutorSchema } from './schema';
import { execSync } from 'child_process';

export default async function runExecutor(options: FlyDeployExecutorSchema) {
  const cwd = options.distLocation;

  const results = execSync(\`fly apps list\`);
  if (results.toString().includes(options.flyAppName)) {
    execSync(\`fly deploy\`, { cwd });
  } else {
    execSync(\`fly launch --now --name=\${options.flyAppName} --region=lax\`, {
      cwd,
    });
  }
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
    'apps/api/src/fly.toml',
  ];
  apiConfig.targets.deploy = {
    executor: '@bg-hoard/internal-plugin:fly-deploy',
    outputs: [],
    options: {
      distLocation: 'dist/apps/api',
      flyAppName: flyName,
    },
    dependsOn: [{ target: 'build', projects: 'self', params: 'forward' }],
  };
  updateProjectConfiguration(host, 'api', apiConfig);

  addDependenciesToPackageJson(host, { cors: '*' }, {});
  replaceInFile(
    host,
    'apps/api/src/main.ts',
    `app.setGlobalPrefix(globalPrefix);
  const port = process.env.PORT || 3000;
`,
    `app.setGlobalPrefix(globalPrefix);
  app.enableCors();
  const port = process.env.PORT || 3000;
`
  );
  await formatFiles(host);
}
