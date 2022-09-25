# 💻 Lab 11 - e2e test the shared component

###### ⏰ Estimated time: 5 minutes
<br />

The storybook generator we invoked earlier also generated some e2e tests. Let's try them out!
<br /><br />

## 📚 Learning outcomes:

- **Take advantage of the e2e tests Nx generated earlier to test your app**
<br /><br /><br />

## 🏋️‍♀️ Steps:

1. Our previous command generated a new `apps/store-ui-shared-e2e` folder. Let's **run them**: `nx e2e store-ui-shared-e2e`
   - The tests should pass!
   <br /><br />
2. Open `apps/store-ui-shared-e2e/src/e2e/header/header.component.cy.ts` and **give the title a value**:

   ```ts
   cy.visit(
      '/iframe.html?id=headercomponent--primary&args=title:BoardGameHoard;'
   )
   ```
   <br /><br />

3. Now **add a test** to check if it contains that value

   ```ts
   it('should show the title', () => {
     cy.get('bg-hoard-header').contains('BoardGameHoard');
   });
   ```
   <br /><br />

4. **Re-run the tests**
   <br /><br />
5. **Inspect what changed** from the last time you committed, then **commit your changes**
   <br /><br />

---

[➡️ Next lab ➡️](../lab12/LAB.md)
