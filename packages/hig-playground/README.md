## hig-integration-prototype

This project demonstrates a model for creating a strict separation between HIG.Web and Orion

## Structure

```
src/
  - App.js      - Demonstrates how an application consumes Orion
  - HIG.Web.js  - Demonstrates how HIG.Web components are built
  - higify.js   - Convert a HIG.Web component to React
  - Orion.js    - Describe the HIG.Web heirarchy in React
```

## TODO

- Automate the creation of the HIG heirarchy and Stateless React components via interface.json
- Add a demonstration where Orion wraps a Stateless React component and makes it stateful (instead of the application having to control state exclusively)
- Add a Slot demonstration
- Verify that context can flow from outside the OrionHIG context into a slot
- Verify that components can't be used out of order (show a nice error message if that happens)
- Verify that standard DOM elements can't be used inside the OrionHIG context except for in a Slot