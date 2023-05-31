##### Generate a new type lib for the API

```shell
nx generate @nx/js:lib util-interface --directory=api
```

##### Use the `move` generator to move a nested lib to root

```shell
nx generate @nx/workspace:move --projectName=api-util-interface util-interface
```
