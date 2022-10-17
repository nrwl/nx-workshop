<p style="text-align: center;"><img src="https://raw.githubusercontent.com/nrwl/nx-workshop/master/docs/assets/nxtitle.png"
width="100%" alt="Nx Workshop - Building a Board Game Store"></p>

In this workshop we'll be building a store for a fictional board game company called "The Board Game Hoard".

We're going to be using [Nx](https://nx.dev/) and some of its plugins to accelerate the development of this application.

Some of the things you'll learn:

- Generating a pristine **Nx workspace**
- Generating frontend Angular **apps** and **backend APIs** inside your workspace, with pre-configured proxies
- Creating **shared libs** for re-using code
- Generating new **routed components** with all the lazily loaded routes pre-configured by Nx and ready to go
- How to **organize code** in a monorepo
- Easily **move libs** around your folder structure
- Creating **Storybook stories** and **E2E Cypress tests** for your components
- How to **set boundaries** between the different scopes in your project
- Write automated source **code generators** for common tasks in your workspace
- Set-up **CI workflows** for your Pull Requests
- Add **distributed caching**
- Set up the **NxCloud GitHub integration**
- Write advanced deployment targets using the **run-commands executor**
- Set up **Continuous Deployment** systems that deploy only the **affected projects**

To help you understand how to apply some of these lessons in your own projects, we'll try to build a more "real-world" example. However, because of the time constrains and to make sure we get to cover as much material as possible, we'll provide you with all the code for any "non-Nx" work you need to do (like styling and configuring Angular routes) - so you can focus on learning to use Nx to its full potential.

---

This is what we'll build:

  <img src="docs/assets/game-demo.gif" height="700" alt="lab4 file structure">

### Pre-requisites

Nx has support for a lot of platforms, but in this workshop we'll be using mainly Angular. While all the code for any Angular specific work will be provided, it will help if you have some experience with the Angular ecosystem.

Make sure you have the following installed:

- Node.js version 14.0.0 and up
  - `node --version`
- [Yarn](https://classic.yarnpkg.com/en/docs/install/)
  - `yarn --version`
- A Github account
  - http://github.com

Optional:

- A Heroku account
  - https://heroku.com/
  - with the [CLI installed](https://devcenter.heroku.com/articles/heroku-cli): `heroku --version`
- [Docker](https://www.docker.com/get-started)
  - `docker --version`

### How the labs work

Each lab will have the following sections:

- 📚 **"Learning outcomes"**
  - A summary of the most important things you'll learn in that lab
- 📲 **"After this workshop, your app should look similar to this"**
  - This will contain a screenshot of any changes to the app visuals after the lab
  - Any changes to the source directory structure
- 🏋️‍♀️ **"Steps"**
  - All the lab steps you need to follow

##### Hints and solutions feat. Ron the whale 🐳

While the _mighty narwhal_ is away on secret missions, you will occasionally see his assistant, **Ron The Whale 🐳** offering helpful hints to the different exercises. Please use these if you get stuck.

If you get stuck running any Nx command, there is a `SOLUTION.md` file in each lab's folder.

As mentioned, for anything Angular/styling or HTML template work we will provide the code you need as direct links to the files. Please use these as much as possible.

##### Slides

Can be found [here](https://bit.ly/393cP6G)

### The labs

Each lab will contain a link to the next one. Start from **"Lab 1"** and move through them as required.

##### Catching up with missed labs

If you fall behind or join late, we provide migrations that would bring your repository up to date with desired lab. To use the migrarions follow the next steps:
1. Install `@nrwl/nx-workshop` package as dev dependency (e.g. `yarn add -D @nrwl/nx-workshop`). If you finished [Lab 3.1 - Migrations](docs/lab3.1/LAB.md) then you should already have it installed.
2. Run the generator with one of the following options:
   - Provide `lab` you want to complete: `nx g @nrwl/nx-workshop:complete-labs --lab=5` or
   - Use `from` range to finish until end: `nx g @nrwl/nx-workshop:complete-labs --from=2`
   - Use `to` range to catch up with given lab: `nx g @nrwl/nx-workshop:complete-labs --to=5`
   - Use `from/to` range to catch up with several labs in between: `nx g @nrwl/nx-workshop:complete-labs --from=2 --from=7`
   - Use `option` to specify if you want track 1 or track 2: `nx g @nrwl/nx-workshop:complete-labs --from=19 --option=option2`
3. Finnally, run the the migrations `npx nx migrate --run-migrations` to have that code generated

| Day 1 |
| - |
| 👩‍💻 [Lab 1 - Generate an empty workspace](docs/lab1/LAB.md) |
| ⚗️ [Lab 2 - Generate an Angular app](docs/lab2/LAB.md) |
| 🏃 [Lab 3 - Executors](docs/lab3/LAB.md) |
| 🚂 [Lab 3.1 - Migrations](docs/lab3.1/LAB.md) |
| 🧩 [Lab 4 - Generate a component lib](docs/lab4/LAB.md) |
| 🤝 [Lab 5 - Generate a utility lib](docs/lab5/LAB.md) |
| 🗺️ [Lab 6 - Generate a route lib](docs/lab6/LAB.md) |
| 🏭 [Lab 7 - Add a NestJS API](docs/lab7/LAB.md) |
| 🎨 [Lab 8 - Displaying a full game in the routed game-detail component](docs/lab8/LAB.md) |
| 📏 [Lab 9 - Generate a type lib that the API and frontend can share](docs/lab9/LAB.md) |
| 📖 [Lab 10 - Generate Storybook stories for the shared ui component](docs/lab10%20-%20bonus/LAB.md) |
| 🧪 [Lab 11 - E2E test the shared component](docs/lab11%20-%20bonus/LAB.md) |

| Day 2 |
| - |
| 🛑 [Lab 12 - Module boundaries](docs/lab12/LAB.md) |
| ⚙️ [Lab 13 - Plugins and Workspace Generators - Intro](docs/lab13/LAB.md) |
| 🧵 [Lab 14 - Plugins and Workspace Generators - Modifying files](docs/lab14/LAB.md) |
| 🔎 [Lab 15 - Setting up CI](docs/lab15/LAB.md) |
| ☁️ [Lab 16 - Distributed caching](docs/lab16/LAB.md) |
| 🤖 [Lab 17 - NxCloud GitHub bot](docs/lab17/LAB.md) |
| 🏎️ [Lab 18 - Run-Commands and deploying the frontend](docs/lab18/LAB.md) |

| Option 1 - React frontends and more custom generators practice              | Option 2 - Heroku API deployments with Docker                           |
| --------------------------------------------------------------------------- | ----------------------------------------------------------------------- |
| 🧭 [Lab 19 - Creating and deploying a 2nd frontend](docs/lab19-alt/LAB.md)  | 🚀 [Lab 19 - Deploying the API with custom executor](docs/lab19/LAB.md)                      |
| ⛱️ [Lab 20 - Mock Store](docs/lab20-alt/LAB.md)                             | 🪢 [Lab 20 - Connecting the frontend and backend](docs/lab20/LAB.md)    |
| 🪁 [Lab 21 - Setting up CD for automatic deployment](docs/lab21-alt/LAB.md) | 🎈 [Lab 21 - Setting up CD for automatic deployment](docs/lab21/LAB.md) |
| 💈 [Lab 22 - Deploying only what changed](docs/lab22/LAB.md)                | 💈 [Lab 22 - Deploying only what changed](docs/lab22/LAB.md)            |
