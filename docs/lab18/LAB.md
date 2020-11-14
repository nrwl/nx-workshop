### 💻 Lab 18 - Run-Commands and deploying the frontend

//TODO update the emojis at the top

###### ⏰ Estimated time: 5-10 minutes

#### 📚 Learning outcomes:

- Understand how to bootstrap a new Nx workspace

#### 🏋️‍♀️ Steps :

1. Switch back to `master`
2. `yarn add surge`
3. In `workspace.json` add an architect for the `store` project:

```
"deploy": {
  "builder": "@nrwl/workspace:run-commands",
  "outputs": [],
  "options": {
    "command":
      "surge ./ ${SURGE_DOMAIN} --token ${SURGE_TOKEN}",
    "cwd": "dist/apps/store",
    "parallel": false
  }
}
```

4. Get the surge token:

```
surge token
```

5. Create a new file: `apps/store/.local.env`

```
SURGE_TOKEN=your-surge-token
SURGE_DOMAIN=https://some-unique-url-123.surge.sh
```

6. `nx build store --configuration production && nx deploy store`

You should see surge deploying to your URL - if you click you'll see just the header though, because it doesn't have a server to get the games from.

---

🎓If you get stuck, check out [the solution](SOLUTION.md)

---

[➡️ Next lab ➡️](../lab13/LAB.md)
