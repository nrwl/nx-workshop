# Nx Workshop - Building a Board Game Store

In this workshop we'll be building a store for a fictional board game company called "The Board Game Hoard".

We're going to be using [Nx](https://nx.dev/) and some its plugins to accelerate the development of this app.

Some of the things you'll learn:

- Generating a pristine Nx workspace
- Generating frontend Angular apps and backend APIs inside your workspace, with pre-configured proxies
- Creating shared libs for re-using code
- Generating new routed components with all the lazily loaded routes pre-configured by Nx and ready to go
- How to organize code in a monorepo
- Easily move libs around your folder structure
- Creating Storybook stories and e2e Cypress tests for your components
- How to set boundaries between the different scopes in your project
- Write automated source code generators for common tasks in your workspace
- Set-up CI for your Pull Requests
- Add distributed caching
- Set up the NxCloud GitHub integration
- Write advanced deployment targets using the `run-commands` executor
- Set up Continuous Deployment systems that deploy only the affected projects

To help you understand how to apply some of these lessons in your own projects, we'll try to build a more "real-world" example. However, because of the time constrains and to make sure we get to cover as much material as possible, we'll provide you with all the code for any "non-Nx" work you need to do (like styling and configuring Angular routes) - so you can focus on learning to use Nx to its full potential.

This is what we'll build:

  <img src="docs/assets/game-demo.gif" height="700" alt="lab4 file structure">

### Pre-requisites

Nx has support for a lot of platforms, but in this workshop we'll be using mainly Angular. While all the code for any Angular specific work will be provided, it will help if you have some experience with the Angular ecosystem.

Make sure you have the following installed:

- Node.js version 10 and up
    - `node --version`
- [Yarn](https://classic.yarnpkg.com/en/docs/install/)
    - `yarn --version`
- A Github account
    - http://github.com
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

Finally, if you fall behind or join late, Git branches are provided for each lab, which will fast forward you to that lab - `git checkout lab-x` (where `x` is the number of the lab you want to start).

If you want to skip ahead to the end: `git checkout final-solution`

### The labs

Each lab will contain a link to the next one. Start from **"Lab 1"** and move through them as required:

#### Day 1

- 🔬 [Lab 1 - Generate an empty workspace](docs/lab1/LAB.md)
- ⚗️ [Lab 2 - Generate an Angular app](docs/lab2/LAB.md)
- 🧪 [Lab 3 - Executors](docs/lab3/LAB.md)
- 🔭 [Lab 4 - Generate a component lib](docs/lab4/LAB.md)
- 🧬 [Lab 5 - Generate a utility lib](docs/lab5/LAB.md)
- 🧮 [Lab 6 - Generate a route lib](docs/lab6/LAB.md)
- 🤖 [Lab 7 - Add a NestJS API](docs/lab7/LAB.md)
- 📐 [Lab 8 - Displaying a full game in the routed game-detail component](docs/lab8/LAB.md)
- 💻 [Lab 9 - Generate a type lib that the API and frontend can share](docs/lab9/LAB.md)
- 👩‍💻 [Lab 10 - Generate Storybook stories for the shared ui component](docs/lab10%20-%20bonus/LAB.md)
- ⌨️ [Lab 11 - E2E test the shared component](docs/lab11%20-%20bonus/LAB.md)

#### Day 2

- 💡 [Lab 12 - Module boundaries](docs/lab12/LAB.md)
- 🧸️ [Lab 13 - Workspace Generators - Intro](docs/lab13/LAB.md)
- 🧵 [Lab 14 - Workspace Generators - Modifying files](docs/lab14/LAB.md)
- 💎 [Lab 15 - Setting up CI](docs/lab15/LAB.md)
- 🔌 [Lab 16 - Distributed caching](docs/lab16/LAB.md)
- 🔍 [Lab 17 - NxCloud GitHub bot](docs/lab17/LAB.md)
- 📎 [Lab 18 - Run-Commands and deploying the frontend](docs/lab18/LAB.md)
- 🧲 [Lab 19 - Deploying the API](docs/lab19/LAB.md)
- 🎸 [Lab 20 - Connecting the frontend and backend](docs/lab20/LAB.md)
- 🎈 [Lab 21 - Setting up CD for automatic deployment](docs/lab21/LAB.md)
- 💈 [Lab 22 - Deploying only what changed](docs/lab22/LAB.md)
