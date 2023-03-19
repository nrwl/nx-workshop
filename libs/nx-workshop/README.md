# Nx Workshop Utility

> This library was generated with [Nx](https://nx.dev).

This library contains migrations, generators and executors used during the [Nx Workshop](https://github.com/nrwl/nx-workshop).

## How to use lab migrations generator

1. Install `@nrwl/nx-workshop` package as dev dependency (e.g. `npm i -D @nrwl/nx-workshop`)
2. Run the generator with one of the following options:
   - Provide `lab` you want to complete: `nx g @nrwl/nx-workshop:complete-labs --lab=5`
   - Use `from` range to finish until end: `nx g @nrwl/nx-workshop:complete-labs --from=2`
   - Use `to` range to catch up with given lab: `nx g @nrwl/nx-workshop:complete-labs --to=5`
   - Use `from/to` range to catch up with several labs in between: `nx g @nrwl/nx-workshop:complete-labs --from=2 --from=7`
   - Use `option` to specify if you want track 1 or track 2: `nx g @nrwl/nx-workshop:complete-labs --from=19 --option=option2`
3. Run the generated migrations: `npx nx migrate --run-migrations`
