import { formatFiles, readJsonFile, Tree } from '@nrwl/devkit';
import { CompleteLabsGeneratorSchema } from './schema';

export default async function (
  tree: Tree,
  options: CompleteLabsGeneratorSchema
) {
  const { lab, from, to, option } = options;
  const migrationDefinitions = readJsonFile(
    'node_modules/@nrwl/nx-workshop/migrations.json'
  ).generators;
  let migrations = Object.keys(migrationDefinitions).map((name) => {
    const { version, description, implementation, cli } =
      migrationDefinitions[name];
    return {
      version,
      description,
      factory: implementation,
      cli,
      package: '@nrwl/nx-workshop',
      name,
    };
  });
  let including = false;
  migrations = migrations
    .filter((migration) => {
      const versionParts = migration.version.split('.');
      const lastVersionPart = versionParts[versionParts.length - 1];
      const optionSuffix = option === 'option1' ? '-alt' : '';
      const firstLab = from || lab;
      const firstLabString =
        firstLab < 19 ? firstLab + '' : firstLab + optionSuffix;
      if (lastVersionPart === firstLabString) {
        including = true;
      }
      const lastLab = to || lab;
      const lastLabString =
        lastLab < 19 ? lastLab + '' : lastLab + optionSuffix;
      if (lastVersionPart === lastLabString) {
        including = false;
        return true;
      }
      return including;
    })
    .filter((migration) => {
      const versionParts = migration.version.split('.');
      const lastVersionPart = versionParts[versionParts.length - 1];
      if (option == 'option2') {
        return !Number.isNaN(+lastVersionPart);
      } else {
        return +lastVersionPart < 19 || Number.isNaN(+lastVersionPart);
      }
    });
  tree.write('migrations.json', JSON.stringify({ migrations }, undefined, 2));
  await formatFiles(tree);
  console.log('Migration file generated, to complete the labs run:');
  console.log('nx migrate --run-migrations=migrations.json');
}
