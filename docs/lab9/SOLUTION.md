##### Generate a new type lib for the API

```shell
nx generate @nrwl/workspace:lib util-interface --directory=api --linter=tslint
```

##### Use the `move` schematic to move a nested lib to root

```shell
nx generate @nrwl/workspace:move --projectName=api-util-interface util-interface
```
