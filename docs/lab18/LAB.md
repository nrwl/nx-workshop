### 💻 Lab 18 - Run-Commands and deploying the frontend

//TODO update the emojis at the top

###### ⏰ Estimated time: 5-10 minutes

#### 📚 Learning outcomes:

- Understand how to bootstrap a new Nx workspace

#### 🏋️‍♀️ Steps :

1. Switch back to `master`
2. `yarn add surge`
4. Get the surge token (you'll need to create an account with an email and password)

```
yarn surge token
```

Copy the token you get in that command.

5. Create a new file: `apps/store/.local.env`

```
SURGE_TOKEN=your-surge-token
SURGE_DOMAIN=https://some-unique-url-123.surge.sh
```

3. Generate a new run-commands architect:

```
nx generate run-commands deploy --project=store --command="surge dist/apps/store ${SURGE_DOMAIN} --token ${SURGE_TOKEN}"
```

6. Let's make sure the store is built for production:
 
 `nx build store --configuration production`
 
 7. Now let's invoke the builder we added earlier:
 
 `nx deploy store`
 
 Note for Windows users: at this the command might fail, as we're trying to access env variables the Linux-way.
 To make it pass:
 
 ```
nx generate run-commands windows-deploy --project=store --command="surge dist/apps/store %SURGE_DOMAIN% --token %SURGE_TOKEN%"
nx windows-deploy store
```

You should see surge deploying to your URL - if you click you'll see just the header though, because it doesn't have a server to get the games from.

---

🎓If you get stuck, check out [the solution](SOLUTION.md)

---

[➡️ Next lab ➡️](../lab19/LAB.md)
